import {Post} from "@/helpers/interfaces"

export const useUtils = () => {
  // Filter out undefined, null, 0, '', false, NaN, {}, []
  // Keep {a: null}, {b: undefined}
  // Examples:
  // hasValue() // false
  // hasValue(undefined)) // false
  // hasValue(null) // false
  // hasValue(0) // false
  // hasValue('') // false
  // hasValue(false) // false
  // hasValue(NaN) // false
  // hasValue([]) // false
  // hasValue({}) // false
  // hasValue({a:null}) // true
  // hasValue({b:undefined}) // true
  // hasValue({c:1}) // true
  // hasValue(new Date()) // true
  // hasValue([0]) // false
  // hasValue([null]) // false
  // hasValue([undefined]) // false
  // hasValue([[undefined], [0], [null, NaN], '']) // false
  // hasValue([[undefined], [0], [null, 1], '']) // true
  // hasValue([[undefined], 1, [null, NaN], '']) // true
  // hasValue([[null], 0, [true, NaN]]) // true
  // hasValue([[null], 0, ['hello', NaN]]) // true
  const hasValue = (el?: any) => {
    // Filter out undefined, null, 0, '', false, NaN
    if (!el) return false

    // Filter out an empty object
    if (
      el // <- null and undefined check
      && Object.keys(el).length === 0
      && Object.getPrototypeOf(el) === Object.prototype
    ) {return false}

    // Filter out an empty array
    if (Array.isArray(el) && !el?.length) {return false}

    // Recursively check for at least one value inside an array
    if (Array.isArray(el) && el?.length) {
      let hasAtLeastOneValue: boolean = false
      el.forEach(function (e) {
        if (hasValue(e)) {
          hasAtLeastOneValue = true
        }
      })

      if (hasAtLeastOneValue) {
        return true
      } else {
        console.error("ERROR. There are no values in the array", el)
        return false
      }
    }

    return true
  }

  // const post1 = {} // false
  // const post2 = {id: 123} // true
  // const post3 = {title: "123"} // false
  // const post4 = {signature: "0x123"} // false
  // const post5 = {url: "http"} // true
  // const post6 = {signature: "0x1", action: "post"} // true
  // const post7 = {signature: "0x1", action: "react"} // false
  // const post8 = {signature: "0x1", action: "reply"} // false
  // const post9 = {signature: "0x1", action: "react", target: "1"} // true
  // const post10 = {signature: "0x", action: "reply", target: "1"} // true
  // console.log("post1:", isValidPost(post1))
  // console.log("post2:", isValidPost(post2))
  // console.log("post3:", isValidPost(post3))
  // console.log("post4:", isValidPost(post4))
  // console.log("post5:", isValidPost(post5))
  // console.log("post6:", isValidPost(post6))
  // console.log("post7:", isValidPost(post7))
  // console.log("post8:", isValidPost(post8))
  // console.log("post9:", isValidPost(post9))
  // console.log("post10:", isValidPost(post10))
  const isValidPost = (post?: Post): boolean => {
    if (!post) { return false }

    if (!hasValue(post)) {
      console.error("ERROR. A post has no values:", post)
      return false
    }

    if (!post.signature && !post.url && !post.id && !post.ipfs) {
      console.error("ERROR. A post has no signature, url, or id", post)
      return false
    }

    if (post.signature) {
      if (!post.action) {
        console.error("ERROR. A post with signature has no action", post)
        return false
      }
      if (post.action === 'post') {return true}

      if (post.action === 'reply' && !post.target) {
        console.error("ERROR. A post with signature and a reply action has no target:", post)
        return false
      } else if (post.action === 'reply' && post.target) {
        return true
      }

      if (post.action === 'react' && !post.target) {
        console.error("ERROR. A post with signature and a react action has no target:", post)
        return false
      } else if (post.action === 'react' && post.target) {
        return true
      }
    }

    if (post.url) {return true}

    if (post.id) {return true}

    if (post.ipfs) {return true}

    console.error("ERROR. Not a valid post:", post)
    return false
  }

  // const posts0 = [] // false
  // const posts1 = [[]] // false
  // const posts2 = [{}, {}] // false
  // const posts3 = [{id: 1}, {title: "123"}] // false
  // const posts4 = [{id: 1}, {id: 2, signature: "0x123"}] // false
  // const posts5 = [{id: 1}, {signature: "0x1", action: "reply"}] // false
  // const posts6 = [{id: 1}, {signature: "0x1", action: "react"}] // false
  // const posts7 = [{id: 1}, {signature: "0x1", action: "post"}] // true
  // const posts8 = [{signature: "0", action: "reply", target: "1"}] // true
  // console.log("posts0:", areValidPosts(posts0))
  // console.log("posts1:", areValidPosts(posts1))
  // console.log("posts2:", areValidPosts(posts2))
  // console.log("posts3:", areValidPosts(posts3))
  // console.log("posts4:", areValidPosts(posts4))
  // console.log("posts5:", areValidPosts(posts5))
  // console.log("posts6:", areValidPosts(posts6))
  // console.log("posts7:", areValidPosts(posts7))
  // console.log("posts8:", areValidPosts(posts8))
  const areValidPosts = (posts?: Post[]): boolean => {
    // console.log("areValidPosts called")
    if (!posts) {
      // console.log("ERROR. Posts is undefined/null", posts)
      return false
    }

    // Filter out non-array
    if (!Array.isArray(posts)) {
      // console.log("ERROR. Posts is not an array", posts)
      return false
    }

    // Filter out an empty array
    if (Array.isArray(posts) && !posts?.length) {
      // console.log("Posts is an empty array", posts)
      return false
    }

    let areAllPostsValid: boolean = true
    posts.forEach(function (post) {
      if (!isValidPost(post)) {
        console.error("ERROR. Post inside posts is not a valid post", post)
        areAllPostsValid = false
      }
    })

    if (!areAllPostsValid) {
      console.error("ERROR. At least one post in posts is not a valid post", posts)
      return false
    }

    return true
  }

  return {
    hasValue,
    isValidPost,
    areValidPosts,
  }
}
