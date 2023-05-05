import {Post} from "@/helpers/interfaces"

export const useTime = () => {
  const timeAgo = (post?: Post) => {
    if (!post) {return ''}
    if (!post.pubdate && !post.added_time) {return ''}
    if (typeof(post.pubdate) !== "string" &&
        typeof(post.added_time) !== "string") {return ''}

    // calculate time ago (1m, 3h, 2mo, etc.)
    const dateSource = post.pubdate as string
      || post.added_time as string
    const pubDate = new Date(Date.parse(dateSource))
    const pubTimestamp: number = new Date(pubDate).getTime()
    function timeSince(date: number): string {
      const seconds = Math.floor(((new Date().getTime() / 1000) - date / 1000))

      let interval = Math.floor(seconds / 31536000)
      if (interval >= 1) {return interval + 'y'}

      interval = Math.floor(seconds / 2592000)
      if (interval >= 1) {return interval + 'mo'}

      interval = Math.floor(seconds / 86400)
      if (interval >= 1) {return interval + 'd'}

      interval = Math.floor(seconds / 3600)
      if (interval >= 1) {return interval + 'h'}

      interval = Math.floor(seconds / 60)
      if (interval >= 1) {return interval + 'm '}

      // return Math.floor(seconds) + 's'
      return 'new'
    }

    return timeSince(pubTimestamp)
  }

  return {
    timeAgo,
  }
}
