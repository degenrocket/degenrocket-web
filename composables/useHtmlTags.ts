import {Post} from '@/helpers/interfaces'

/**
 * Allowing external content to be embedded into a website with
 * iframe HTML tags is a potential attack vector, so the complex
 * logic with many security checks has been chosen.

 * Firstly, an admin has to enable iframe tags via environment
 * variables for selected users, posts, comments, then whitelist
 * eligible signers and domains.

 * Secondly, we use a complex logic to display the content.
 * The easiest approach would be to add iframe tags to the string
 * on the next line after each eligible URL and then display that
 * one string as HTML via 'v-html' or via 'v-dompurify-html' with
 * an allowed iframe tags option.
 * However, we don't need to use 'v-html' at all if markdown is
 * disabled via environment variables, so the simple approach to
 * displaying the whole string via 'v-html' would introduce
 * a completely unnecessary attack vector.
 * Thus, it was decided to parse the whole original string (text),
 * find lines that contain eligible URLs, split it at the end of
 * the line, add that chunk to the array of text chunks, then add
 * eligible URL with iframe tags to the array of URL chunks, and
 * then continue parsing the original string (text) for more URLs.
 * As a result, we'll have two arrays: one with chunks of text that
 * contain eligible URLs and the other one with chunks of URLs at
 * corresponding indexes.

 * Let's look at the example:
 * Line one: https://bad.com
 * Line two: https://good.com/1
 * Line three: https://good.com/2
 * Line four: the end.

 * The first array with text chunks will have 3 elements:
 * 1: Line one: https://bad.com\nLine two: https://good.com/1
 * 2: Line three: https://eligible2.com
 * 3: Line four: the end.

 * The second array with iframe URLs will have 2 elements:
 * 1: <iframe src="https://good.com/1"></iframe>
 * 2: <iframe src="https://good.com/2"></iframe>

 * We can then display the user input from the first array of text
 * chunks as plain text if markdown is disabled, which is a safer
 * approach than the simplest solution described at the start.
 * We will only need to use 'v-html' for iframe URLs from the
 * second array, which was generated by our script, not by the
 * user. That should significantly reduce attack vectors for
 * instances that wish to enable iframe for whitelisted users,
 * but keep markdown disabled for security reasons.

 * The final result will be displayed in the template:
 * Line one: https://bad.com\nLine two: https://good.com/1
 * <iframe src="https://good.com/1"></iframe>
 * Line three: https://good.com/2
 * <iframe src="https://good.com/2"></iframe>
 * Line four: the end.

 * The final result will look like:
 * Line one: https://bad.com
 * Line two: https://good.com/1
 * <Embedded video 1>
 * Line three: https://good.com/2
 * <Embedded video 2>
 * Line four: the end.
 */

export const useHtmlTags = () => {
  const config = useRuntimeConfig()
  const env = config?.public
  const enableEmbedIframeTagsForSelectedUsers: boolean = env?.enableEmbedIframeTagsForSelectedUsers === 'true' ? true : false
  const iframeHideOneLineUrl: boolean = env?.iframeHideOneLineUrl === 'true' ? true : false
  const signersAllowedToEmbedIframeTags: string = env?.signersAllowedToEmbedIframeTags
  const iframeTagsAllowedDomains: string = env?.iframeTagsAllowedDomains
  const iframeVideoWidth: string = env?.iframeVideoWidth
  const iframeVideoHeight: string = env?.iframeVideoHeight
  const iframeAdditionalParams: string = env?.iframeAdditionalParams

  // Check if a signer is allowed to embed iframe tags
  const checkIfSignerAllowedIframe = (signer: string): boolean => {
    if (!enableEmbedIframeTagsForSelectedUsers) {
      return false
    }

    let ArrayOfIframeSigners: string[] = ['']
    let isSignerAllowedIframe: boolean = false

    if (typeof(signersAllowedToEmbedIframeTags) === 'string') {
      ArrayOfIframeSigners = signersAllowedToEmbedIframeTags.toLowerCase().split(',')
    }

    if (typeof(signer) === 'string') {
      if (ArrayOfIframeSigners.includes(signer.toLowerCase())) {
        isSignerAllowedIframe = true
      } else {
        isSignerAllowedIframe = false
      }
    }
    return isSignerAllowedIframe
  }

  const checkIfUrlIsAllowedIframeDomain = (url: string): boolean => {
    let ArrayOfAllowedDomains: string[] = ['']
    let isUrlAllowedDomain: boolean = false

    if (iframeTagsAllowedDomains.length < 1) {
      return false
    }

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

  // Parent function
  const getArrayOfArraysOfTextAndTags = (post: Post): string[][] => {
    if (typeof(post.text) !== 'string') {
      return [['ERROR: post.text is not a string.']]
    }

    // Check if everything is allowed according to .env settings
    if (!checkIfEverythingIsAllowed(post)) {
      return [[post.text]]
    }

    // Check if text has any URLs
    if (!checkIfTextHasUrl(post.text)) {
      return [[post.text]]
    }

    // Split text into two arrays of text chunks and URL chunks
    const finalArrayOfArrays = splitTextIntoChunks(post.text)

    return finalArrayOfArrays
  }

  // Split text into array of text chunks and array of URL chunks.
  //
  // Function returns an array of two arrays:
  //
  // First array contains text chunks.
  // Each element of this array ends with a line that contains
  // at least one or more URLs.
  //
  // Second array contains URLs with added iframe tags.
  // Each element contains one or more URLs from the element
  // of the first array with corresponding index.
  //
  // That way, you can sanitize HTML tags from the first array,
  // which contains user input.
  // HTML tags from the seconds array don't have to be sanitized
  // since they were generated by the code below. 
  const splitTextIntoChunks = (text: string): string[][] => {
    if (typeof(text) !== 'string') {
      return [['ERROR: Text is not a string'],['']]
    }

    // const urlRegex = /(https?:\/\/[^\s\])]+)/g;
    const urlRegex = /(https?:\/\/[^\s\])]+)(?![,!])/g;

    // Matches the string only if the whole string is a URL.
    const urlRegexFullLine = /^(https?:\/\/[^\s\])]+)(?![,!])$/g;
    
    const linesOfText = text.split('\n')

    let arrayOfTextChunks: string[] = ['']

    let arrayOfUrlChunks: string[] = ['']

    let chunkIndex = 0

    // Loop through all lines
    linesOfText?.forEach((line): void => {
      if (!line) return

      // Add the current line to array of text chunks
      if (line) {
        // Some instances want to embed videos with iframe tags
        // without displaying the actual URL to users.
        // Check if the whole line consists of only one URL,
        // and hide it if the URL hiding is enabled in the .env file.
        if (urlRegexFullLine.test(line) && iframeHideOneLineUrl) {
          // Check for undefined with ||
          arrayOfTextChunks[chunkIndex] = (arrayOfTextChunks[chunkIndex] || '') + `\n`
        } else {
          // Check for undefined with ||
          arrayOfTextChunks[chunkIndex] = (arrayOfTextChunks[chunkIndex] || '') + `${line}\n`
        }
      }

      const arrayOfUrlsInLine = line.match(urlRegex)

      let ifLineHasAtLeastOneUrl: boolean = false

      // Loop through all URLs in the line
      arrayOfUrlsInLine?.forEach((url): void => {
        if (!checkIfUrlIsAllowedIframeDomain(url)) {
          return
        }

        ifLineHasAtLeastOneUrl = true

        // Remove dot (.) at the end of URL if exists
        // const cleanUrl = url.replace(/\.$/, "")
        let cleanUrl: string = url
        if (url.endsWith(".")) {
          cleanUrl = url.slice(0, -1);
        }

        const urlWithTags = addIframeTagsToUrl(cleanUrl)

        arrayOfUrlChunks[chunkIndex] = (arrayOfUrlChunks[chunkIndex] || '') + `${urlWithTags}<br>`
      })

      // Most lines will have no URL,
      // Some lines will have one URL,
      // A few lines will have multiple URLs.
      // Thus, move to another element if line has at least one URL,
      // but only move after all URLs from this line were added to
      // the array, because some lines have multiple eligible URLs.
      if (ifLineHasAtLeastOneUrl) {
        chunkIndex ++
      }
    })

    return [arrayOfTextChunks, arrayOfUrlChunks]
  }

  const addIframeTagsToUrl = (url: string): string => {
    if (typeof(url) !== 'string') {
      return `<iframe></iframe>`
    }

    return `<iframe src="${url}" ${iframeAdditionalParams} width="${iframeVideoWidth}" height="${iframeVideoHeight}"></iframe>`
  }

  // Check if text has any URLs
  const checkIfTextHasUrl = (text: string): boolean => {
    // Match if URL is anywhere in the string:
    if (typeof(text) !== 'string') {
      return false
    }

    // Match if URL is anywhere in the string:
    const urlRegex = /(https?:\/\/[^\s\])]+)/g;
    return urlRegex.test(text)
  }

  // Do all the environment setting checks to make
  // sure that HTML tags are enabled in the .env file.
  const checkIfEverythingIsAllowed = (post: Post): boolean => {
    // Check if iframe tags are enabled for whitelisted users
    if (!enableEmbedIframeTagsForSelectedUsers) {
      return false
    }

    // Since embedding videos via iframe tags is an
    // additional attack vector, let's check again
    // if the signer is allowed to embed iframe tags.
    if (typeof(post?.signer) === 'string') {
      if (!checkIfSignerAllowedIframe(post?.signer)) {
        // Not allowed
        return false
      }
    } else {
      // Another safeguard. Return if signer is not a string
      return false
    }

    // Return true if everything is good
    return true
  }

  return {
    checkIfSignerAllowedIframe,
    checkIfUrlIsAllowedIframeDomain,
    getArrayOfArraysOfTextAndTags,
    splitTextIntoChunks,
    checkIfTextHasUrl,
  }
}
