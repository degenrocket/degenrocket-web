import {Post} from '@/helpers/interfaces'

export const useHtmlTags = () => {
  const config = useRuntimeConfig()
  const env = config?.public
  const enableEmbedIframeTagsForSelectedUsers = env?.enableEmbedIframeTagsForSelectedUsers
  const signersAllowedToEmbedIframeTags = env?.signersAllowedToEmbedIframeTags
  const iframeTagsAllowedDomains = env?.iframeTagsAllowedDomains
  const iframeVideoWidth = env?.iframeVideoWidth
  const iframeVideoHeight = env?.iframeVideoHeight
  const iframeAdditionalParams = env?.iframeAdditionalParams

  // Check if a signer is allowed to embed iframe tags
  const checkIfSignerAllowedIframe = (signer: string) => {
    let ArrayOfIframeSigners:string[] = ['']
    let isSignerAllowedIframe = false

    if (typeof(signersAllowedToEmbedIframeTags) === 'string') {
      ArrayOfIframeSigners = signersAllowedToEmbedIframeTags.split(',')
    }

    if (typeof(signer) === 'string') {
      if (ArrayOfIframeSigners.includes(signer)) {
        isSignerAllowedIframe = true
      } else {
        isSignerAllowedIframe = false
      }
    }
    return isSignerAllowedIframe
  }

  const checkIfUrlIsAllowedIframeDomain = (url: string): boolean => {
    let ArrayOfAllowedDomains:string[] = ['']
    let isUrlAllowedDomain = false

    if (typeof(iframeTagsAllowedDomains) === 'string') {
      ArrayOfAllowedDomains = iframeTagsAllowedDomains.split(',')
    }

    ArrayOfAllowedDomains?.forEach((allowedDomain) => {
      if (url.startsWith(allowedDomain)) {
        isUrlAllowedDomain = true
      }
    })

    return isUrlAllowedDomain
  }

  // Check iframe
  const addIframeTags = (post: Post): string => {
    // Check if iframe tags are enabled for whitelisted users
    if (!enableEmbedIframeTagsForSelectedUsers) {
      return post.text as string
    }

    // Since embedding videos via iframe tags is an
    // additional attack vector, let's check again
    // if the signer is allowed to embed iframe tags.
    if (typeof(post?.signer) === 'string') {
      if (!checkIfSignerAllowedIframe(post?.signer)) {
        // Not allowed
        return post.text as string
      }
    } else {
      // Another safeguard. Return if signer is not a string
      return post.text as string
    }

    let ifTextHasUrl = false

    let textWithUrls:string = ''

    // Check if text has any URLs
    if (typeof(post?.text) === 'string') {
      textWithUrls = post?.text

      // Match only if URL is at the start (^) and it's the end ($) of the string
      // const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      const urlRegex = /(https?:\/\/[^\s\])]+)/g;

      ifTextHasUrl = urlRegex.test(post?.text)

      // Check all URLs
      if (ifTextHasUrl) {
        const arrayOfUrls = post?.text.match(urlRegex)

        // Loop through all URLs
        arrayOfUrls?.forEach((url) => {

          // Add iframe tags
          // The long link is specified instead of 'https://iframe'
          // to reduce attack vectors.
          // if (url.startsWith("https://iframe.mediadelivery.net/embed/")) {
          if (checkIfUrlIsAllowedIframeDomain(url)) {
            /* const index = textWithUrls.indexOf(url) + url.length; */
            const index = textWithUrls.indexOf(url);

            const iframeTags = `<iframe src="${url}" ${iframeAdditionalParams} width="${iframeVideoWidth}" height="${iframeVideoHeight}"></iframe>`
            // Embed <iframe> and show the original url after that
            // const newString = `${textWithUrls.slice(0, index)}\n${iframeTags}\n${textWithUrls.slice(index)}`;
            // Delete the url, only embed <iframe> tags
            // const newStringWithIframeTags = `${textWithUrls.slice(0, index)}\n${iframeTags}\n${textWithUrls.slice(index + url.length)}`;
            // textWithUrls = newStringWithIframeTags

            const lines = textWithUrls.split('\n')

            // Sometimes the URL is added via markdown, so it's better
            // to embed the video on the next line after the URL.
            // Thus, we gonna split the original string (post.text) into
            // the array of lines, then find a line with a particular URL,
            // and add <iframe> tags to the next element of the array,
            // and finally join all lines into one array again.
            // Find the index of the line containing the URL
            let urlLineIndex;
            for (let i = 0; i < lines.length; i++) {
              // if (urlRegex.test(lines[i])) {
              if (lines[i].includes(url)) {
                urlLineIndex = i;
                break;
              }
            }

            // Insert the custom tag after the line with the URL
            if (typeof(urlLineIndex) === 'number') {
              lines.splice(urlLineIndex + 1, 0, iframeTags);
            }

            // Join the lines back into a string
            textWithUrls = lines.join('\n');
          }
        })
      }
    }

    return textWithUrls

  }

  return {
    checkIfSignerAllowedIframe,
    checkIfUrlIsAllowedIframeDomain,
    addIframeTags,
  }
}
