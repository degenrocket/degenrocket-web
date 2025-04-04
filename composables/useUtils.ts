import {
  Post,
  PostSignature,
  SpasmEventAuthorV2,
  SpasmEventBodyAuthorV2,
  SpasmEventMentionV2,
  SpasmEventV2,
  SubscribeToNostrRelayConfig,
  CustomSubscribeToNostrRelayConfig
} from "./../helpers/interfaces"
import DOMPurify from 'dompurify';
import { spasm } from 'spasm.js'
import {marked} from 'marked'

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
      // For of is used instead of forEach to break from
      // the loop once at least one element has value.
      for (const e of el) {
        if (hasValue(e)) {
          hasAtLeastOneValue = true
          break
        }
      }

      if (hasAtLeastOneValue) {
        return true
      } else {
        // console.error("ERROR. There are no values in the array", el)
        return false
      }
    }

    return true
  }

  const isArrayOfStrings = (array: any): boolean => {
    if (!Array.isArray(array)) return false
    if (
      array.length > 0 &&
      array.every(element => typeof(element) === "string")
    ) {
      return true
    }
    return false
  }

  const isArrayOfNumbers = (array: any): boolean => {
    if (!array) return false
    if (!Array.isArray(array)) return false
    if (
      array.length > 0 &&
      array.every(element => typeof(element) === "number")
    ) {
      return true
    }
    return false
  }

  const isArrayOfStringsOrNumbers = (array: any): boolean => {
    if (!array) return false
    if (!Array.isArray(array)) return false
    if (
      array.length > 0 &&
      array.every(element =>
        typeof(element) === "string" ||
        typeof(element) === "number"
      )
    ) {
      return true
    }
    return false
  }

  const isArrayOfNumbersOrStrings = isArrayOfStringsOrNumbers

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

  const isArrayWithValues = (array: any): boolean => {
    if (!array) return false
    if (!Array.isArray(array)) return false
    if (!hasValue(array)) return false
    return true
  }

  const isStringOrNumber = (val: any): boolean => {
    if (!val && val !== 0) return false
    if (typeof(val) === "string") return true
    if (typeof(val) === "number") return true
    return false
  }

  const isNumberOrString = isStringOrNumber
  const ifStringOrNumber = isStringOrNumber
  const ifNumberOrString = isStringOrNumber

  const isObjectWithValues = (val: any): boolean => {
    if (!val) return false
    if (Array.isArray(val)) return false
    if (typeof(val) !== "object") return false
    if (Object.keys(val).length === 0) return false

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

  const isValidSpasmEventV2 = (
    event?: SpasmEventV2 | null
  ): boolean => {
    if (!event) { return false }
    if (!isObjectWithValues(event)) { return false }

    if (
      !("type" in event) || !event.type ||
      event.type !== "SpasmEventV2"
    ) { return false }

    if (
      !event.signatures && !event.ids &&
      !event.authors && !event.action &&
      !event.title && !event.content
    ) { return false }

    if (event.signatures) {
      if (!Array.isArray(event.signatures)) { return false }
      if (!event.authors && !event.ids) { return false }
      if (event.action === 'reply' && !event.parent) {
        return false
      } 
      if (event.action === 'react' && !event.parent) {
        return false
      } 
    }

    if (event.ids) {
      if (!Array.isArray(event.ids)) { return false }
    }

    if (event.authors) {
      if (!Array.isArray(event.authors)) { return false }
    }

    return true
  }

  const areValidSpasmEventsV2 = (
    events?: SpasmEventV2[]
  ): boolean => {
    if (!events) { return false }
    if (!isArrayWithValues(events)) { return false }

    if (!events?.length) { return false }

    let areAllEventsValid: boolean = true
    events.forEach(function (event) {
      if (!isValidSpasmEventV2(event)) {
        areAllEventsValid = false
      }
    })

    if (!areAllEventsValid) { return false }

    return true
  }

  const toBeString = (input: any): string => {
    switch (typeof input) {
      case 'number':
        return input.toString();
      case 'boolean':
        // Converts boolean to 'true' or 'false'
        return input.toString();
      case 'object':
        // Arrays are technically also objects in JS
        if (
          input && input !== null &&
          typeof(input) === 'object'
        ) {
          try {
            return JSON.stringify(input);
          } catch (e) {
            // Return empty string if JSON.stringify fails
            return '';
          }
        }
        break;
      case 'string':
        return input;
      default:
        return '';
    }
    return ''; // Fallback for cases not covered by the switch
  }

  /**
   * Converts value to a consistent timestamp across all platforms.
   * Input time value can be string, number, or Date object.
   * returns Consistent timestamp in milliseconds or undefined.
   */
  const toBeTimestamp = (
    originalTime: any
  ): number | undefined => {
    if (!originalTime) return undefined
    let time = Number(originalTime)
      ? Number(originalTime)
      : originalTime

    // First, normalize the input to a Date object
    let date: Date

    // Handle numeric inputs (timestamps or years)
    if (
      typeof time === 'number' &&
      !isNaN(time) &&
      Number.isSafeInteger(time)
    ) {
      date = new Date(time);
      
      if (!isValidDate(date)) {
        return undefined
      }
    } 
    // Handle string inputs
    else if (typeof time === 'string') {
      try {
        // Try parsing with timezone specification
        date = new Date(`${time} GMT`)
        
        // Fallback to standard parsing if needed
        if (!isValidDate(date)) {
          date = new Date(time)
          if (!isValidDate(date)) {
            return undefined
          }
        }
      } catch (err) {
        return undefined
      }
    } 
    // Handle Date objects
    else if (time instanceof Date) {
      date = time
      
      if (!isValidDate(date)) {
        return undefined
      }
    } 
    // Invalid input type
    else {
      return undefined
    }

    // Always use UTC for consistency
    return isValidDate(date) ? date.getTime() : undefined
  }

  const isValidDate = (date: Date): boolean => {
    return (
      date instanceof Date &&
      !isNaN(date.getTime()) &&
      Number.isFinite(date.getTime())
    )
  }

  /*
  const toBeTimestamp = (time: any): number | undefined => {
   let date = new Date(time);
   let timestamp = date.getTime();

    // Check if the timestamp is NaN, indicating an invalid date
    if (Number.isNaN(timestamp)) {
      if (Number(time)) {
        date = new Date(Number(time))
        timestamp = date.getTime()
        if (Number(timestamp)) {
          return timestamp
        }
      }
      return undefined;
    }

    // Optional
    // Standardize the timestamp to 10 characters (seconds)
    // by rounding down the timestamp to the nearest second.
    // if (timestamp.toString().length > 10) {
    //   timestamp = Math.floor(timestamp / 1000) * 1000;
    // }

   return timestamp;
  }
  */

  // Nostr relays only accept 10 digits long timestamps
  const toBeShortTimestamp = (
    value: string | number
  ): number | null => {
    if (!value || !isStringOrNumber) return null
    let timestamp = toBeTimestamp(value)
    if (!timestamp) return null
    if (String(timestamp) && String(timestamp).length === 13) {
      const str = String(timestamp)
      if (str && str.slice(0,10)) {
        const shortStr = str.slice(0,10)
        if (Number(shortStr)) { return Number(shortStr) }
      }
    } else if (
      String(timestamp) && String(timestamp).length === 10
    ) { return timestamp }
    return null
  }

  const toBeLongTimestamp = (
    value: string | number
  ): number | null => {
    if (!value || !isStringOrNumber) return null
    let timestamp = toBeTimestamp(value)
    if (!timestamp) return null
    // Some timestamps are 10 digits long, so we
    // need to standardize them to 13 digits
    if (String(timestamp) && String(timestamp).length === 10) {
      timestamp = timestamp * 1000;
    }
    if (
      timestamp && typeof(timestamp) === "number" &&
      String(timestamp) && String(timestamp).length >= 13
    ) {
      return timestamp
    } else {
      return null
    }
  }

  const toBeFullTimestamp = toBeLongTimestamp
  const toBeStandardizedTimestamp = toBeShortTimestamp
  const toBeStandardTimestamp = toBeShortTimestamp
  const toBeNostrTimestamp = toBeShortTimestamp

  const toBeDate = (value: string | number): string => {
    if (!value || !isStringOrNumber) return ""
    let timestamp = toBeLongTimestamp(value)
    if (!timestamp) return ""
    const date = new Date(Number(timestamp)).toDateString()
    if (date && typeof(date) === "string") {
      return date
    } else {
      return ""
    }
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

  // Doesn't work for all events, e.g., some Nostr relays
  // rearrange keys in the event, so 'originalObject' in
  // 'sibling' in SpasmEventV2 might be different.
  // It's better to use spasm utils instead:
  // spasm.pushToArrayIfEventIsUnique(array, event)
  // However, it'll only work for supported event kinds.
  const pushToArrayIfValueIsUnique = (
    array: any[], item: any
  ): void => {
    if (!Array.isArray(array)) return
    const itemString: string = JSON.stringify(item)
    if (!itemString) return
    let isUnique: boolean = true
    array.forEach(arrayItem => {
      const arrayItemString: string = JSON.stringify(arrayItem)
      if (
        arrayItemString && itemString &&
        arrayItemString === itemString
      ) { isUnique = false }
    })
    if (isUnique) { array.push(item) }
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

  const copyOf = deepCopyOfObject

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
          // TODO handle if item is an array or use:
          // spasm.sanitizeEvent
          // spasm.sanitizeEventWithDompurify
        });
      }
    });
  }


  const splitStringIntoArrayOfStrings = (
    value: string,
    separator: string = ',',
    ifTrim: boolean = true
  ): string[] => {
    const array: string[] = []
    if (!value || typeof(value) !== "string") { return array }
    const dirtyArray: string[] =
      value.toLowerCase().split(separator)
    dirtyArray.forEach(el => {
      if (el && typeof(el) === "string") {
        // Remove whitespace
        if (ifTrim) {array.push(el.trim())} else {array.push(el)}
      }
    })
    return array
  }

  const splitIntoArray = splitStringIntoArrayOfStrings

  const sliceAddress = (
    address?: string | PostSignature,
    start: number = 6,
      end: number = 4
  ) => {
    return address
      ? `${address.slice(0, start)}...${address.slice(-end)}`
      : ''
  }

  const sliceId = (
    id: string | number,
    start: number = 6,
      end: number = 4,
      max?: number // used for URL length
  ): string => {
    if (!id) { return '' }
    const str: string = String(id) ? String(id) : ''
    if (!str) return ''

    let maxChar: number = Number(start) ? Number(start) : 6
    if (Number(end)) { maxChar += Number(end) }
    if (max && Number(max)) { maxChar = Number(max) }

    // ID is URL
    try {
      const url = new URL(str)
      if (url && typeof(url) === "object") {
        let slicedUrl = ''
        if (url.hostname && typeof(url.hostname) === "string") {
          slicedUrl += url.hostname
        }
        if (url.pathname && typeof(url.pathname) === "string") {
          slicedUrl += url.pathname
        }
        if (url.search && typeof(url.search) === "string") {
          slicedUrl += url.search
        }
        if (slicedUrl) {
          if (slicedUrl.length > maxChar + 3) {
            return `${slicedUrl.slice(0, maxChar)}...`
          } else {
            return slicedUrl
          }
        } else { '' }
      }
    } catch (err) {
      // Not a valid URL
      // console.error(err);
    }

    // else
    return str
      ? `${str.slice(0, start)}...${str.slice(-end)}`
      : ''
  }

  const randomNumber = (min = 1, max = 1000000) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  type MergeObjectsHandleArrays =
    "overwriteArrays" | "mergeArrays"

  const mergeObjects = (
    defaultObject: Object,
    customObject: Object,
    handleArrays: MergeObjectsHandleArrays = "overwriteArrays",
    depth: number = 0
  ): Object => {
    const maxRecursionDepth = 50
    if (depth > maxRecursionDepth) {
      throw new Error("Maximum recursion depth exceeded")
    }

    if (
      !isObjectWithValues(defaultObject) &&
      !isObjectWithValues(customObject)
    ) return {}
    if (
      isObjectWithValues(defaultObject) &&
      !isObjectWithValues(customObject)
    ) return defaultObject
    if (
      !isObjectWithValues(defaultObject) &&
      isObjectWithValues(customObject)
    ) return customObject

    const mergedObject: Object = { ...defaultObject };

    for (const key in customObject) {
      const value = customObject[key]
      const defaultValue = defaultObject[key]
      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        value !== null
      ) {
        // If the value is an object, recursively merge it
        mergedObject[key] = mergeObjects(
          defaultValue, value, handleArrays, depth + 1
        )
      } else if (
        Array.isArray(value) &&
        hasValue(value) &&
        handleArrays === "mergeArrays"
      ) {
        mergedObject[key] =
          mergeArrays(defaultValue, value)
      } else if (
        value !== undefined
      ) {
        mergedObject[key] = value
      }
    }

    return mergedObject
  }

  const mergeSubscribeToNostrRelayConfigs = (
    defaultConfig: SubscribeToNostrRelayConfig,
    customConfig: CustomSubscribeToNostrRelayConfig,
    handleArrays: MergeObjectsHandleArrays = "overwriteArrays"
  ): SubscribeToNostrRelayConfig => {
    const newConfig =
      mergeObjects(defaultConfig, customConfig, handleArrays)
    return newConfig as SubscribeToNostrRelayConfig
  }

  const mergeArrays = (
    original: any[],
    newArray: any[]
  ): any[] => {
    const result: any[] = [];
    const seen: Set<any> = new Set();

    // Function to safely add elements to avoid duplicates
    function safeAdd(element: any) {
      if (!seen.has(element)) {
        seen.add(element);
        result.push(element);
      }
    }

    // Add all unique elements from both arrays
    original.forEach(safeAdd);
    newArray.forEach(safeAdd);

    return result;
  }

  const mergeMentions = (
    original: SpasmEventAuthorV2[]
      | SpasmEventBodyAuthorV2[]
      | SpasmEventMentionV2[],
    newArray: SpasmEventAuthorV2[]
      | SpasmEventBodyAuthorV2[]
      | SpasmEventMentionV2[]
  ): SpasmEventAuthorV2[] => {
    const result: SpasmEventAuthorV2[] = [];
    const seen: Set<any> = new Set();

    // Function to safely add mentions to avoid duplicates
    const safeAddMentions = (
      mention: SpasmEventMentionV2 | SpasmEventAuthorV2
    ) => {
      if (
        'addresses' in mention && mention.addresses && 
        Array.isArray(mention.addresses) &&
        mention.addresses[0] && mention.addresses[0].value &&
        typeof(mention.addresses[0].value) === 'string'
      ) {
        if (!seen.has(mention.addresses[0].value)) {
          seen.add(mention.addresses[0].value);
          result.push(mention);
        }
      } else if (
        'usernames' in mention && mention.usernames && 
        Array.isArray(mention.usernames) &&
        mention.usernames[0] && mention.usernames[0].value &&
        typeof(mention.usernames[0].value) === 'string'
      ) {
        if (!seen.has(mention.usernames[0].value)) {
          seen.add(mention.usernames[0].value);
          result.push(mention);
        }
      }
    }

    // Add all unique elements from both arrays
    original.forEach(safeAddMentions);
    newArray.forEach(safeAddMentions);

    // Remove unnecessary keys like 'verified'
    // TODO implement better logic to keep markers and hosts
    const cleanResult: SpasmEventAuthorV2[] =
      spasm.sortAuthorsForSpasmEventV2(result)

    return cleanResult
  }

  const standardizeTextForDisplay = (
    original: string,
    type: "post" | "reply"
  ): string => {
    if (!original || typeof(original) !== "string") return ''
    if (!type) return ''
    if (type !== "post" && type !== "reply") return ''

    // Replace &gt; with '>' to make sure that blockquote is
    // properly displayed, but don't replace '<' because it can
    // start a potentially malicious HTML tag.
    // const text = original.replace(/\n&gt; /g, '> ')
    let text = original.replace(/&gt; /g, '> ')

    const env = useRuntimeConfig()?.public
    const enableMarkdownInPosts: boolean =
      env?.enableMarkdownInPosts === 'true'? true : false
    const enableMarkdownInComments: boolean =
      env?.enableMarkdownInComments === 'true'? true : false

    if (type === "post" && enableMarkdownInPosts) {
      text = marked(text, {breaks:true})
    }

    if (type === "reply" && enableMarkdownInComments) {
      text = marked(text, {breaks:true})
    }

    return text
  }

  const extractTextForDisplay = (
    event: SpasmEventV2
  ) => {
    const spasmEvent = spasm.toBeSpasmEventV2(event)
    if (!spasmEvent) return ""

    let content: string = ''
    if (
      'content' in spasmEvent && spasmEvent.content &&
      typeof(spasmEvent.content) === "string"
    ) { content = spasmEvent.content }

    let action: "post" | "reply" = "post"
    if (
      'action' in spasmEvent && spasmEvent.action &&
      typeof(spasmEvent.action) === "string"
    ) {
      if (
        spasmEvent.action === "post" ||
        spasmEvent.action === "reply"
      ) { action = spasmEvent.action }
    }

    return standardizeTextForDisplay(content, action)
  }

  const wait = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  const autoGeneratedName = (value: string | number): string => {
    if (!value) return ""
    if (
      typeof(value) !== "string" &&
      typeof(value) !== "number"
    ) { return "" }

    const firstTech = [
      "bankless",
      "black",
      "blue",
      "dark",
      "decoded",
      "encoded",
      "fluffy",
      "free",
      "golden",
      "gray",
      "green",
      "hidden",
      "indie",
      "new",
      "neon",
      "orange",
      "purple",
      "red",
      "private",
      "pirate",
      "quantum",
      "scaling",
      "secure",
      "shadow",
      "silver",
      "stable",
      "swapping",
      "unbanked",
      "unstable",
      "white",
      "zero",
    ]

    const secondTech = [
      "airdrop",
      "alpha",
      "arbitrage",
      "block",
      "darknet",
      "defi",
      "degen",
      "chain",
      "code",
      "crypto",
      "cypher",
      "cult",
      "foss",
      "freedom",
      "hash",
      "jupiter",
      "key",
      "layer",
      "ledger",
      "linux",
      "lunar",
      "market",
      "mars",
      "meme",
      "mesh",
      "moon",
      "network",
      "night",
      "onion",
      "rollup",
      "script",
      "silkroad",
      "snapshot",
      "solar",
      "source",
      "space",
      "spasm",
      "tech",
      "token",
      "wallet",
      "zk",
    ]

    const thirdTech = [
      "auditor",
      "bot",
      "broker",
      "builder",
      "burner",
      "cyborg",
      "dev",
      "doxxer",
      "exchanger",
      "explorer",
      "farmer",
      "fighter",
      "flipper",
      "forker",
      "geek",
      "hacker",
      "hamster",
      "hodler",
      "hunter",
      // "innovator",
      "keeper",
      "kitty",
      // "liberator",
      // "maker",
      "master",
      "maxi",
      "miner",
      "minter",
      "mixer",
      "naut",
      "node",
      "noncer",
      "phantom",
      "punk",
      "rebel",
      "robot",
      "rocket",
      "router",
      "samourai",
      "scanner",
      "sharder",
      "signer",
      "sniffer",
      "stalker",
      "swapper",
      "tester",
      "trader",
      "wizard",
    ]

    const getNumberHashFromValue = (value: any): number => {
      let seed = ""
      if (typeof(value) === "number") {
        seed = value.toString()
      } else if (typeof(value) === "string") {
        seed = value
      }

      seed = seed.toLowerCase()

      // Map each character to its numerical value,
      // ignoring non-alphanumeric characters
      const charMap = 'abcdefghijklmnopqrstuvwxyz0123456789'
      let sum = 0
      const maxLength = 64 // Maximum number of chars to process

      for (
        let i = 0; i < Math.min(seed.length, maxLength); i++
      ) {
          const charCode = seed[i];
          const index = charMap.indexOf(charCode);
          if (index !== -1) { // Character found in map
            // Multiply by 2 to reduce collisions
            sum = Math.floor(sum * 2) + index
          }
      }
      // Ensure the result fits within 32 bits
      return sum % (2 ** 32)
    }

    let sum = getNumberHashFromValue(value)

    const getUsernameFromNumber = (value: number) => {
      // Use the sum to determine the index for selecting a word from each array
      const index1 = Math.abs((value * 11) % firstTech.length);
      const index2 = Math.abs((value * 13 * 17) % secondTech.length);
      const index3 = Math.abs((value * 19 * 23 * 29) % thirdTech.length);

      // There might be multiple different dictionaries
      const env = useRuntimeConfig()?.public
      const enableAutoGeneratedNamesDictionaryTech: boolean =
        env?.enableAutoGeneratedNamesDictionaryTech === 'true'? true : false

      let word1 = ""
      let word2 = ""
      let word3 = ""

      // Select a word from each array using the calculated indices
      if (enableAutoGeneratedNamesDictionaryTech) {
        word1 = firstTech[index1];
        word2 = secondTech[index2];
        word3 = thirdTech[index3];
      } else {
        // Use default dictionary
        // (currently equal to tech dictionary)
        word1 = firstTech[index1];
        word2 = secondTech[index2];
        word3 = thirdTech[index3];
      }

      // Combine the selected words to form the unique name
      const titleCaseWord = (word: string) => {
        if (!word) return word
        return word[0].toUpperCase() + word.slice(1)
      }

      return titleCaseWord(word1) +
             titleCaseWord(word2) +
             titleCaseWord(word3)
    }

    let username = getUsernameFromNumber(sum)
    
    while (username.length > 16) {
      sum += 31
      username = getUsernameFromNumber(sum)
    }

    return username
  }


  return {
    hasValue,
    isArrayOfStrings,
    isArrayOfNumbers,
    isArrayOfStringsOrNumbers,
    isArrayOfNumbersOrStrings,
    isArrayOfStringsWithValues,
    isArrayWithValues,
    isStringOrNumber,
    isNumberOrString,
    ifStringOrNumber,
    ifNumberOrString,
    isObjectWithValues,
    isValidPost,
    areValidPosts,
    isValidSpasmEventV2,
    areValidSpasmEventsV2,
    toBeString,
    toBeTimestamp,
    toBeFullTimestamp,
    toBeStandardizedTimestamp,
    toBeStandardTimestamp,
    toBeNostrTimestamp,
    isValidDate,
    toBeDate,
    isValidUrl,
    copyToClipboard,
    removeDuplicatesFromArray,
    removeNonStringValuesFromArray,
    emptyAllNestedArraysInsideObject,
    deleteMatchingValuesFromObject,
    pushToArrayIfValueIsUnique,
    deepCopyOfObject,
    copyOf,
    sanitizeObjectValuesWithDompurify,
    splitStringIntoArrayOfStrings,
    splitIntoArray,
    sliceAddress,
    sliceId,
    randomNumber,
    mergeObjects,
    mergeSubscribeToNostrRelayConfigs,
    mergeArrays,
    mergeMentions,
    standardizeTextForDisplay,
    extractTextForDisplay,
    wait,
    autoGeneratedName
  }
}
