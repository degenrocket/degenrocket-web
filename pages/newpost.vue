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
        <InfoCreateNewMessageForm
          :formAction="'post'"
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
          whitelistedForActionPost?.includes(connectedAddress.toLowerCase())"
        >
          <div class="mb-4">
            Your address is whitelisted to create new posts.
          </div>
          <InfoCreateNewMessageForm
            :formAction="'post'"
          />
        </div>

        <!-- Connected address is not whitelisted -->
        <div v-if="connectedAddress &&
          typeof(connectedAddress) === 'string' &&
          !whitelistedForActionPost?.includes(connectedAddress.toLowerCase())"
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
import {useAppConfigStore} from '@/stores/useAppConfigStore'
const appConfigStore = useAppConfigStore()
// Updating app config so users can create new posts after
// being whitelisted without refreshing the web page.
await appConfigStore.fetchAndUpdateAppConfig()
// New web3 actions are enabled by default if not disabled in .env
const enableNewWeb3ActionsAll: boolean =
  appConfigStore.getAppConfig.enableNewWeb3ActionsAll
const enableNewWeb3ActionsPost: boolean =
  appConfigStore.getAppConfig.enableNewWeb3ActionsPost
const enableWhitelistForActionPost: boolean =
  appConfigStore.getAppConfig.enableWhitelistForActionPost
const whitelistedForActionPost: string[] =
  appConfigStore.getAppConfig.whitelistedForActionPost
const {
  connectedAddress,
  /* assembledMessage, */
  /* connectedAddressEthereum, */
  /* connectedAddressNostr,    */
} = useWeb3()
const { sliceAddress } = useUtils()
</script>

<style scoped></style>

