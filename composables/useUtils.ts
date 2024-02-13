import {Post} from "@/helpers/interfaces"
import DOMPurify from 'dompurify';

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
        // console.error("ERROR. There are no values in the array", el)
        return false
      }
    }

    return true
  }

  const isArrayOfStrings= (array: any): boolean => {
    if (!Array.isArray(array)) return false
    if (
      array.length > 0 &&
      array.every(element => typeof(element) === "string")
    ) {
      return true
    }
    return false
  }

  const isArrayOfStringsWithValues = (array: any): boolean => {
    if (!Array.isArray(array)) return false
    if (!hasValue(array)) return false
    if (
      array.length > 0 &&
      array.every(element => typeof(element) === "string") &&
      array.every(element => hasValue(element))
    ) {
      return true
    }
    return false
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
      // console.error("ERROR. A post has no values:", post)
      return false
    }

    if (!post.signature && !post.url && !post.id && !post.ipfs) {
      // console.error("ERROR. A post has no signature, url, or id", post)
      return false
    }

    if (post.signature) {
      if (!post.action) {
        // console.error("ERROR. A post with signature has no action", post)
        return false
      }
      if (post.action === 'post') {return true}

      if (post.action === 'reply' && !post.target) {
        // console.error("ERROR. A post with signature and a reply action has no target:", post)
        return false
      } else if (post.action === 'reply' && post.target) {
        return true
      }

      if (post.action === 'react' && !post.target) {
        // console.error("ERROR. A post with signature and a react action has no target:", post)
        return false
      } else if (post.action === 'react' && post.target) {
        return true
      }
    }

    if (post.url) {return true}

    if (post.id) {return true}

    if (post.ipfs) {return true}

    // console.error("ERROR. Not a valid post:", post)
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
        // console.error("ERROR. Post inside posts is not a valid post", post)
        areAllPostsValid = false
      }
    })

    if (!areAllPostsValid) {
      // console.error("ERROR. At least one post in posts is not a valid post", posts)
      return false
    }

    return true
  }

  const isValidUrl = (value?: any): boolean => {
    if (!value) return false
    try { 
        // new URL() constructor is less vulnerable to ReDoS attacks
        // because it's a built-it JS function that doesn't use regex
        new URL(value); 
        return true; 
    }
    catch(e) { 
        return false; 
    }
  }

  const copyToClipboard = (value: string | number | undefined): void => {
    if (value && (typeof(value) === "string")) {
      navigator.clipboard.writeText(value)
    } else if (value && (typeof(value) === "number")) {
      navigator.clipboard.writeText(value.toString())
    }
  }

  // The Set data structure only stores unique values.
  // When the array is converted into a Set, any duplicate values
  // are automatically removed. Then, the spread operator (...)
  // is used to convert the Set back into an array 1.
  const removeDuplicatesFromArray = (
    array: (string | number)[]
  ): (string | number)[] => {
    if (!Array.isArray(array)) {
      return []
    }
    return [...new Set(array)];
  }

  const removeNonStringValuesFromArray = (
    array: any[]
  ): (string)[] => {
    let arrayOfStrings: string[] = []
  
    if (!Array.isArray(array)) {
      return []
    }

    array.forEach((value) => {
      if (value && typeof(value) === "string") {
        arrayOfStrings.push(value)
      }
    })

    return arrayOfStrings
  }

  const emptyAllNestedArraysInsideObject = (obj: any) => {
    for (let key in obj) {
      if (Array.isArray(obj[key])) {
        obj[key] = [];
      } else if (typeof obj[key] === 'object') {
        emptyAllNestedArraysInsideObject(obj[key]);
      }
    }
    return obj
  }

  const deleteMatchingValuesFromObject = (obj1: any, obj2: any) => {
    for (let key in obj1) {
      if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
        obj1[key] = obj1[key].filter((val: any) => !obj2[key].includes(val));
      } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
        deleteMatchingValuesFromObject(obj1[key], obj2[key]);
      }
      // // Additional logic for handling booleans and strings
      // else if ((typeof obj1[key] === 'boolean' || typeof obj1[key] === 'string') &&
      //          (typeof obj2[key] === 'boolean' || typeof obj2[key] === 'string')) {
      //   // Define behavior for booleans and strings here
      //   // If you want to delete the value from obj1 if it matches obj2, you could do something like:
      //   if (obj1[key] === obj2[key]) {
      //     delete obj1[key];
      //   }
      // }
    }
    return obj1;
  };

  const pushToArrayIfValueIsUnique = (array: any[], item: any) => {
    if (!Array.isArray(array)) return
    if (!array.includes(item)) {
      array.push(item);
    }
  }

/**
 * In JavaScript it's common to create shallow copies using:
 * let testPost = { ...validPost };
 * let testPost = Object.assign({}, validPost);
 * These methods often won't satisfy the needs, because a
 * shallow copy means creating a new object and copying over
 * all the properties from the original object. However, if
 * the property value is a reference to another object
 * (like an array or another object), the new object will still
 * hold a reference to the original object, not a copy of it.
 * So, if you modify the nested object in the new object,
 * it will also modify the original object.
 * Another use case is console logging ref objects from e.g.
 * pinia store, which will be logged as proxy, so we won't know
 * the values of such objects on the moment of execution, but
 * we will rather get the final states of such objects.
 * Making a deep copy of an object allows us to console log
 * the state of the object at the moment of execution, e.g.:
 * console.log(deepCopyOfObject(object))
 * The deep copy of an object can be created using JSON.parse
 * and JSON.stringify, e.g.:
 * const copyOfObject = JSON.parse(JSON.stringify(object));
 */
  const deepCopyOfObject = (obj: any) => {
    if (!obj || typeof(obj) !== "object") return {}
    return JSON.parse(JSON.stringify(obj))
  }

  const sanitizeObjectValuesWithDompurify = (obj: any) => {
    if (typeof(obj) !== "object") return

    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string') {
        obj[key] = DOMPurify.sanitize(obj[key]);

      } else if (typeof obj[key] === 'object') {
        sanitizeObjectValuesWithDompurify(obj[key]);

      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((item: any, index: number) => {
          if (typeof item === 'string') {
            obj[key][index] = DOMPurify.sanitize(item);

          } else if (typeof item === 'object') {
            sanitizeObjectValuesWithDompurify(item);
          }
        });
      }
    });
  }


  return {
    hasValue,
    isArrayOfStrings,
    isArrayOfStringsWithValues,
    isValidPost,
    areValidPosts,
    isValidUrl,
    copyToClipboard,
    removeDuplicatesFromArray,
    removeNonStringValuesFromArray,
    emptyAllNestedArraysInsideObject,
    deleteMatchingValuesFromObject,
    pushToArrayIfValueIsUnique,
    deepCopyOfObject,
    sanitizeObjectValuesWithDompurify
  }
}
