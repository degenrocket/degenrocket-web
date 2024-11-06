<template>
  <div class="my-4 mx-2 overflow-auto overflow-wrap break-words">
    <!-- New post actions are enabled -->
    <div v-if="enableNewWeb3ActionsAll && enableNewWeb3ActionsPost">
        <div
          v-if="connectedAddress &&
          typeof(connectedAddress) === 'string'"
          class="mt-2 mb-4"
        >
          <div>
            Connected main address: {{ sliceAddress(connectedAddress, 8, 6) }}
            <ExtraAddressIcons
              v-if="connectedAddress"
              :key="connectedAddress"
              :value="connectedAddress"
              :showCopyToClipboard="true"
              :showQrCode="true"
              :showExternalWebsite="true"
            />
          </div>
          <!--
          <div>
            Connected Ethereum address: {{ connectedAddressEthereum }}
          </div>
          <div>
            Connected Nostr address: {{ connectedAddressNostr }}
          </div>
          -->
        </div>

      <!-- White list is disabled, everybody can create posts -->
      <div v-if="!enableWhitelistForActionPost">
        <InfoCreateNewPostForm
          :target="''"
        />
      </div>

      <!-- White list is enabled -->
      <div v-if="enableWhitelistForActionPost">
        <p>
          This instance requires addresses to be whitelisted
          in order to create new posts.
        </p>

      <!-- No address is connected -->
        <div v-if="!connectedAddress">
          Connect your address using the 'connect' button
          to see whether you've been whitelisted to create
          new posts on this instance.
        </div>

        <!-- Connected address is whitelisted -->
        <div v-if="connectedAddress &&
          typeof(connectedAddress) === 'string' &&
          whitelistedForActionPost.includes(connectedAddress.toLowerCase())"
        >
          <div class="mb-4">
            Your address is whitelisted to create new posts.
          </div>
          <InfoCreateNewPostForm
            :target="''"
          />
        </div>

        <!-- Connected address is not whitelisted -->
        <div v-if="connectedAddress &&
          typeof(connectedAddress) === 'string' &&
          !whitelistedForActionPost.includes(connectedAddress.toLowerCase())"
        >
          <div>
            Your address is not whitelisted to create new posts
            on this instance.
          </div>
        </div>
      </div>
    </div>

    <!-- New post actions are disabled -->
    <div v-else>
      Submitting all new web3 posts is currently disabled
    </div>
  </div>
</template>

<script setup lang="ts">
// New web3 actions are enabled by default if not disabled in .env
const env = useRuntimeConfig()?.public
const enableNewWeb3ActionsAll: boolean =
  env?.enableNewWeb3ActionsAll === 'false'? false : true
const enableNewWeb3ActionsPost: boolean =
  env?.enableNewWeb3ActionsPost === 'false'? false : true
const enableWhitelistForActionPost: boolean =
  env?.enableWhitelistForActionPost === 'true'? true : false
const whitelistedForActionPost: string[] =
  typeof(env?.whitelistedForActionPost) === "string"
  ? env?.whitelistedForActionPost.toLowerCase().split(',')
  : []
const {
  connectedAddress,
  /* assembledMessage, */
  /* connectedAddressEthereum, */
  /* connectedAddressNostr,    */
  sliceAddress
} = useWeb3()
</script>

<style scoped></style>

