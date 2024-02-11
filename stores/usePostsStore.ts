import {defineStore} from 'pinia'
import {useFetch} from '#app'
import {Post, PostId} from '@/helpers/interfaces'
import {FeedFilters} from '@/helpers/interfaces'

import {useProfilesStore} from '@/stores/useProfilesStore'
// const profilesStore = useProfilesStore()

const {feedFilters} = useFeedFilters()
const {logPosts, logTime} = useLog()
const {hasValue} = useUtils()

export interface IPostsState {
  apiUrl: any
  allPosts: Post[]
  postComments: Post[]
  displayFilters: FeedFilters
  selectedIds: Array<string | number | null | undefined>
  fetchingPostsByFilters: boolean
  currentPostId: PostId
}

// console.log = () => {}

export const usePostsStore = defineStore('postsStore', {
  state: (): IPostsState => ({
    apiUrl: useRuntimeConfig()?.public?.apiURL,

    // appPosts contains all posts fetched from the server,
    // sorted by date and cleaned from duplicates.
    allPosts: [],

    // postComments contains all comments for the current post
    postComments: [],

    // Display filters are used by getters to display posts.
    // Display filters are manually updated after saving newly
    // fetched posts into the store in order to prevent blinking.
    // If use feedFilters instead, then after changing filters,
    // posts from the store will be shown in the feed for a short
    // time before being replaced by newly fetched posts.
    displayFilters: {},
    selectedIds: [],
    fetchingPostsByFilters: false,
    currentPostId: null
  }),

  getters: {
    getPosts(): Post[] {
      return this.filterPosts(this.displayFilters)
    },

    getPost(): Post {
      // console.log("getPost called")
      if (!this.currentPostId) { return {} }

      const postsByIds = this.getPostsByIds([this.currentPostId.toString()])
      // console.log("this.currentPostId.toString():", this.currentPostId.toString())
      return postsByIds[0]
    },

    getPostComments(): Post[] {
      return this.postComments
    },
  },

  actions: {
    async fetchPostsByFilters(customFilters?: FeedFilters): Promise<void> {
      if (!this.apiUrl) {return }

      this.fetchingPostsByFilters = true

      const path = this.apiUrl + '/api/posts'

      // It's necessary to copy filters into another object,
      // because otherwise there is some bug with useFetch()
      // when used together with watch(), which increases
      // an amount of fetch requests after each change of filters.
      let filters = {}
      if (typeof (customFilters) === "object") {
        filters = {...customFilters}
      } else {
        // If no custom filters were passed, then
        // use filters from useFeedFilters() composable.
        filters = {...feedFilters}
      }

      // console.log("Filters before fetching:", filters)
      const {data: fetchedPosts, error} = await useFetch(path, {
        // query: filtersQuery, watch: useFeedFilters().feedFilters
        query: filters
      })

      if (error.value) {
        console.error("Errors during fetch:", error.value)
      }

      // console.log(logTime(), "\nPosts fetched from server according to filters:", logPosts(fetchedPosts.value))

      this.savePostsToStore(fetchedPosts.value)
      this.displayPosts(filters)
      this.fetchingPostsByFilters = false

      // By this time almost all addresses from newly fetched
      // posts and comments should already be in the list of
      // addresses that should be checked for profile info
      // (e.g., username, about, pfp), so we can call the
      // global update function.
      const profilesStore = useProfilesStore()

      profilesStore.updateAllProfiles()

      // console.log(logTime(), "\nAll fetching is finished, displayFilters updated", "\n=======/")
    },

    // TODO
    async fetchPostsByIds(ids: PostId[]): Promise<Post[]> {
      // Promise.all and map are used because
      // await doesn't work with array.forEach
      const fetchedPosts = await Promise.all(ids.map(this.fetchPostById))

      // console.log("allPosts before saving:", logPosts(this.allPosts))
      if (!hasValue(fetchedPosts)) { return fetchedPosts }

      this.savePostsToStore(fetchedPosts)
      // console.log("allPosts after saving:", logPosts(this.allPosts))
      return fetchedPosts
    },

    async fetchPostById(id: PostId): Promise<Post> {
      if (!id) {return {}}
      if (!this.apiUrl) {return {}}

      if (typeof (id) === "number" || "string") {
        const path = this.apiUrl + '/api/posts/search?p=' + id
        const {data: fetchedPost, error} = await useFetch(path)

        if (error.value) {
          console.error(error.value)
          return {}
        }

        return fetchedPost.value

      } else {
        return {}
      }
    },

    savePostsToStore(posts: Post[]): boolean {
      if (!posts?.length || !posts?.[0]) {return false}

      // console.log("Saving posts:\n", logPosts(posts))

      // It's important to have new posts at the start of
      // the new concatPosts array to make sure that old
      // duplicate posts get filtered out instead of new
      // posts during a removeDuplicates() function.
      // Such logic ensures that posts are updated on the
      // frontend with latest reactions and comments.
      const concatPosts = posts.concat(this.allPosts)
      // console.log("Concat posts:", logPosts(concatPosts))

      const cleanPosts = this.removeDuplicates(concatPosts)
      // console.log("Clean posts:", logPosts(cleanPosts))

      const sortedPosts = this.sortPostsByDate(cleanPosts)
      // console.log("Sorted posts:", logPosts(sortedPosts))

      this.allPosts = sortedPosts
      // console.log("allPosts after saving: ", logPosts(this.allPosts))

      // Add addresses to a list of addresses that should be checked
      // for profile info (e.g. usernames) during an update function.
      const profilesStore = useProfilesStore()
      profilesStore.addAddressesFromPosts(this.allPosts)

      return true
    },

    // Filters should be applied at the end of fetching,
    // because there is a time gap between user's click to change
    // active filters and new posts being ready to be shown due to
    // fetching that can sometimes take up to a few seconds.
    displayPosts(filters: FeedFilters): void {
      this.displayFilters = filters
    },

    removeDuplicates(posts?: Post[]): Post[] {
      // Filter out duplicate posts based on post ids
      // console.log("Removing duplicates:", logPosts(posts))

      if (!posts?.length || !posts?.[0]) {return []}

      // In some edge cases posts might not have ids, so we can
      // remove duplicates based on signatures and then on ids.
      // The function can also be used to remove duplicates based
      // on other properties such as url or guid.
      type PostProperty = "signature" | "id" | "guid" | "url"

      // Duplicates usually occur after fetching new posts,
      // if same posts have already been fetched and saved before.
      type PropertyValue = string | number | boolean | null | undefined
      const removeDuplicatesByProperty = (
        posts: Post[], property: PostProperty
      ): Post[] => {
        // Get an array of non-unique ids, signatures, etc.
        // E.g., [101, 103, 102, 101, 101, 105, 105]
        const arrayOfNonUniqueProperties: PropertyValue[] = posts.map(
          (mapPost): PropertyValue => {
            return mapPost?.[property]
          }
        )

        // Filter out duplicates.
        posts = posts.filter((post, index): boolean => {
          // Keep the post if it has no searched property (sig/id)
          if (!post?.[property]) {return true}

          const firstIndexOfPostProperty = arrayOfNonUniqueProperties.indexOf(post?.[property])

          const isPostUnique = firstIndexOfPostProperty === index

          return isPostUnique
        })

        return posts
      }

      posts = removeDuplicatesByProperty(posts, "signature")
      posts = removeDuplicatesByProperty(posts, "id")

      return posts
    },

    // Sort posts chronologically.
    // web2 posts have .pubdate, while web3 posts have .added_time
    // thus, we can either normalize the data or use this solution:
    sortPostsByDate(posts?: Post[]) {
      if (!posts?.length || !posts?.[0]) {return []}

      // Posts without date can mess up sorting and even cause
      // hydration mismatch, so they are moved into separate
      // array, which is added back (via concat) after sorting.
      let postsWithoutDate: Post[] = []
      posts = posts.filter((post: Post): boolean => {
        if (post.added_time || post.pubdate) {
          return true
        }
        postsWithoutDate.push(post)
        return false
      })

      // For web3 posts the added_time param is chosen for sorting
      // instead of signed_time for multiple reasons:
      // 1. signed_time can be set manually by the signer (user),
      //    so it can be far in the future or in the past.
      // 2. It can take a long time for a web3 post to arrive to
      //    the current instance of the network, so if signed_time
      //    was used, then the web3 post could appear at the
      //    bottom of the feed. Thus, added_time is preferred.
      posts.sort((a, b): number => {
        if (a.pubdate && b.pubdate) {
          return b.pubdate.localeCompare(a.pubdate)
        } else if (a.pubdate && b.added_time) {
          return b.added_time.localeCompare(a.pubdate)
        } else if (a.added_time && b.added_time) {
          return b.added_time.localeCompare(a.added_time)
        } else if (a.added_time && b.pubdate) {
          return b.pubdate.localeCompare(a.added_time)
        }
        // Ideally, return 1 should never happen because
        // we've filtered out posts without date above.
        // In case if we missed some scenarios,
        // then 'return 1' should push an element without date
        // to the end of the array, but it can still
        // mess up the sorting.
        return 1
      });

      posts = posts.concat(postsWithoutDate)
      return posts
    },

    filterPosts(filters?: FeedFilters, posts?: Post[]): Post[] {

      posts = posts || this.allPosts || []

      if (!filters) {return posts}

      // TODO: implement web2/web3 filter
      // check if signature exist, then web3
      // otherwise web2.
      // Add web2/3 toggle to feed menu for test.

      const filterByCategory = (post: Post): boolean => {
        if (!filters?.category) return true
        if (filters?.category === 'any') return true
        if (post['category']?.includes(filters?.category as string)) {
          return true
        }
        return false
      }

      const filterByActivity = (post: Post): boolean => {
        let value = 0
        if (filters.activity === "hot") {
          value = 2
        } else if (filters.activity === "rising") {
          value = 1
        } else {
          return true
        }

        if ((post.upvote && post.upvote >= value)
          || (post.downvote && post.downvote >= value)
          || (post.bullish && post.bullish >= value)
          || (post.bearish && post.bearish >= value)
          || (post.important && post.important >= value)
          || (post.scam && post.scam >= value)
          || (post.comments_count && post.comments_count >= value)) {
          return true
        }

        return false
      }

      let filteredPosts = posts.filter(function (post) {
        if (filterByCategory(post)
          && filterByActivity(post)) {
          return post;
        }
      });

      // Since web2 and web3 posts are fetched together, it's
      // necessary to limit the amount of posts shown in the feed
      // otherwise all posts from the store will be shown, which
      // can mess up chronological order and posts can jump around
      // the feed after resorting after fetching new posts. 
      if (typeof filters?.limitWeb2 === 'number'
        && typeof filters?.limitWeb3 === 'number') {
        let numberOfPostsToDisplay: number = 10
        // Choosing the smallest limit as the number of posts to be
        // displayed in the feed provides chronological order of
        // posts after sorting in most cases.
        // Ideally, all limits should be equal to provide the best
        // chronological order. (eg. limitWeb2 and limitWeb3 = 40)
        // However, in that case a lot of posts will be fetched
        // from the server and saved in the store, without
        // displaying them to a user in the feed.
        // (Downside: higher traffic load).
        if (filters.limitWeb2 < filters.limitWeb3) {
          numberOfPostsToDisplay = filters.limitWeb2
        } else {
          numberOfPostsToDisplay = filters.limitWeb3
        }
        filteredPosts.splice(numberOfPostsToDisplay)
      }

      // Prepend selected posts to be shown on top of the feed,
      // if such posts are not shown anywhere else in the feed.
      // For example, when a user opens a website with a link to
      // a specific post, which has been published a long time ago
      // and as a result it doesn't show up in the feed.

      // Step 1.
      // Find ids of posts which are selected,
      // but don't satisfy active filters.
      let selectedIdsNotDisplayed: PostId[] = []

      this.selectedIds.forEach((selectedId) => {
        const checkIfIdExists = (post: Post): boolean => {
          if (post?.id?.toString() === selectedId ||
            post?.signature === selectedId ||
            post?.url === selectedId) {
            return true
          } else {
            return false
          }
        }

        const testedId = filteredPosts.find(checkIfIdExists)

        if (!testedId?.id) {
          selectedIdsNotDisplayed.push(selectedId)
        }
      })

      // Step 2.
      // Get posts from the store of ids that don't satisfy filters
      let stickyPosts: Post[] = []

      if (selectedIdsNotDisplayed?.length > 0) {
        stickyPosts = this.getPostsByIds(selectedIdsNotDisplayed)
      }

      // Step 3.
      // Prepend sticky posts to filtered posts.
      return stickyPosts.concat(filteredPosts)
    },

    setSelectedIds(ids: PostId | PostId[]): void {
      let arrayOfIds: PostId[] = []

      // Concat converts string or number into array
      arrayOfIds = arrayOfIds.concat(ids)

      this.selectedIds = arrayOfIds
    },

    setCurrentPostId(id: PostId): void {
      this.currentPostId = id
    },

    async updateCurrentPost():Promise<void> {
      await this.fetchPostsByIds([this.currentPostId])
    },

    getPostsByIds(ids: PostId | PostId[]): Post[] {
      // console.log("Need to get posts: ", ids)

      // Concat converts string or number into an array
      let arrayOfIds: PostId[] = []
      arrayOfIds = arrayOfIds.concat(ids)
      // console.log("arrayOfIds in getPostsByIds:", arrayOfIds)

      // Search can be done by signature, url, and id
      const posts = this.allPosts.filter(
        i => arrayOfIds.includes(i.signature)
        || arrayOfIds.includes(i.url)
        || arrayOfIds.includes(i.id?.toString())
      );

      // console.log("return posts in getPostsByIds:", posts)
      return posts
    },

    getPostsByShortId(shortId: string): Post[] {
      const posts = this.allPosts.filter(
        post => post.signature != null
        && post.signature.startsWith(shortId))
      return posts
    },

    async getOrFetchPostsByIds(ids: PostId | PostId[]): Promise<Post[] | { error: string }[]> {
      // console.log("Need to find posts: ", ids)

      // Concat converts string or number into array
      let arrayOfIds: PostId[] = []
      arrayOfIds = arrayOfIds.concat(ids)

      if (!this.selectedIds?.[0]) {
        // console.log("no selected ids, time to select some")
        this.setSelectedIds(arrayOfIds)
      }

      // console.log("Need to find array of posts:", arrayOfIds)

      const postsFromStore: Post[] = this.getPostsByIds(arrayOfIds)
      // console.log("Posts found in store:", logPosts(postsFromStore))

      // Fetch posts from server if they don't exist in the store
      if (postsFromStore.length < arrayOfIds.length) {
        // console.log("Not all posts were found in the store")
        const postsFromServer = await this.fetchPostsByIds(arrayOfIds)
        // console.log("Posts from server:", logPosts(postsFromServer))
        return postsFromServer
      } else {
        // console.log("All posts were found in the store")
        // console.log("Posts without fetching:", logPosts(postsFromStore))
      }
      return postsFromStore
    },

    async fetchCommentsBySigUrlIpfs(sigUrlIpfs: string):Promise<Post[]> {
      if (!this.apiUrl) {return []}

      const path: string = `${this.apiUrl}/api/targets/comments/search?target=${sigUrlIpfs}`

      // console.log("path in fetchCommentsBySigUrlIpfs 586970:", path)

      const {data, error} = await useFetch(path)

      if (error.value) {
        console.error(error.value)
      }

      // console.log("data in fetchCommentsBySigUrlIpfs 586970:", data)
      return data.value
    },

    async updatePostComments(sigUrlIpfs: string) {
      this.postComments = await this.fetchCommentsBySigUrlIpfs(sigUrlIpfs)

      // Add addresses to a list of addresses that should be checked
      // for profile info (e.g. usernames) during an update function.
      const profilesStore = useProfilesStore()
      profilesStore.addAddressesFromPosts(this.postComments)
    }
  }
})
