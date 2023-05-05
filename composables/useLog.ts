import {Post} from "@/helpers/interfaces"

// getIdsFromArrayOf is handy for debugging
// to easily log ids from the array of objects (posts).
//
// For example:
//
//const {getIdsFromArrayOf} = useLog()
//console.log(getIdsFromArrayOf(posts))
//
// or
//
//console.log(useLog().getIdsFromArrayOf(posts))

export const useLog = () => {
  const getIdsFromArrayOf = (posts: Post[]) => {
    let ids: (number | null | undefined)[] = []
    if (posts && Array.isArray(posts) && posts.length > 0) {
      posts.forEach(function (post) {
        ids.push(post?.id)
      })
    }
    return ids
  }

  const logPosts = (posts: Post[]) => {
    return getIdsFromArrayOf(posts)
    // return ""
  }

  const logTime = () => {
    // return new Date(Date.now()).toISOString()
    return new Date(Date.now()).toISOString().slice(11,23)
  }

  return {
    getIdsFromArrayOf,
    logPosts,
    logTime
  }
}
