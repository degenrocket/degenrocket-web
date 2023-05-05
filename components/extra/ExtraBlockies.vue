<template>
  <span>
    <canvas ref="canvas" class="Blockies max-w-[82px]" />
  </span>
</template>

<script>
// Source: https://github.com/afa7789/BlockiesVue
import { defineComponent } from 'vue'

/*
    seed: 'randstring', // seed used to generate icon data, default: random
    color: '#dfe', // to manually specify the icon color, default: random
    bgcolor: '#aaa', // choose a different background color, default: random
    size: 15, // width/height of the icon in blocks, default: 8
    scale: 3, // width/height of each block in pixels, default: 4
    spotcolor: '#000' // each pixel has a 13% chance of being of a third color,
*/
export default /* #__PURE__ */ defineComponent({
  name: 'Blockies',
  provide () {
    return {
      provider: this.provider
    }
  }, // vue component name
  props: {
    seed: String,
    color: String, // to manually specify the icon color, default: random
    bgcolor: String, // choose a different background color, default: random
    size: Number, // width/height of the icon in blocks, default: 8
    scale: Number, // width/height of each block in pixels, default: 4
    spotcolor: String // each pixel has a 13% chance of being of a third color,
  },
  data () {
    return {
      randseed: new Array(4),
      provider: {
        context: null
      }
    }
  },
  computed: {},
  mounted () {
    const canvas = this.$refs.canvas
    this.provider.context = canvas.getContext('2d')
    this.renderIcon(canvas)
  },
  methods: {
    seedrand (seed) {
      for (let i = 0; i < this.randseed.length; i++) {
        this.randseed[i] = 0
      }
      for (let i = 0; i < seed.length; i++) {
        this.randseed[i % 4] =
          (this.randseed[i % 4] << 5) -
          this.randseed[i % 4] +
          seed.charCodeAt(i)
      }
    },
    rand () {
      // based on Java's String.hashCode(), expanded to 4 32bit values
      const t = this.randseed[0] ^ (this.randseed[0] << 11)

      this.randseed[0] = this.randseed[1]
      this.randseed[1] = this.randseed[2]
      this.randseed[2] = this.randseed[3]
      this.randseed[3] = this.randseed[3] ^ (this.randseed[3] >> 19) ^ t ^ (t >> 8)

      return (this.randseed[3] >>> 0) / ((1 << 31) >>> 0)
    },
    createColor () {
      // saturation is the whole color spectrum
      const h = Math.floor(this.rand() * 360)
      // saturation goes from 40 to 100, it avoids greyish colors
      const s = this.rand() * 60 + 40 + '%'
      // lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
      const l = (this.rand() + this.rand() + this.rand() + this.rand()) * 25 + '%'

      const color = 'hsl(' + h + ',' + s + ',' + l + ')'
      return color
    },
    createImageData (size) {
      const width = size // Only support square icons for now
      const height = size

      const dataWidth = Math.ceil(width / 2)
      const mirrorWidth = width - dataWidth

      const data = []
      for (let y = 0; y < height; y++) {
        let row = []
        for (let x = 0; x < dataWidth; x++) {
          // this makes foreground and background color to have a 43% (1/2.3) probability
          // spot color has 13% chance
          row[x] = Math.floor(this.rand() * 2.3)
        }
        const r = row.slice(0, mirrorWidth)
        r.reverse()
        row = row.concat(r)

        for (let i = 0; i < row.length; i++) {
          data.push(row[i])
        }
      }

      return data
    },
    buildOpts () {
      const newOpts = {}

      newOpts.seed = this.seed ||
        Math.floor(Math.random() * Math.pow(10, 16)).toString(16)

      this.seedrand(newOpts.seed)

      newOpts.size = this.size || 8
      newOpts.scale = this.scale || 4
      newOpts.color = this.color || this.createColor()
      newOpts.bgcolor = this.bgcolor || this.createColor()
      newOpts.spotcolor = this.spotcolor || this.createColor()

      return newOpts
    },
    renderIcon (canvas) {
      const opts = this.buildOpts()
      const imageData = this.createImageData(opts.size)
      const width = Math.sqrt(imageData.length)

      canvas.width = canvas.height = opts.size * opts.scale

      const cc = canvas.getContext('2d')
      cc.fillStyle = opts.bgcolor
      cc.fillRect(0, 0, canvas.width, canvas.height)
      cc.fillStyle = opts.color

      for (let i = 0; i < imageData.length; i++) {
        // if data is 0, leave the background
        if (imageData[i]) {
          const row = Math.floor(i / width)
          const col = i % width

          // if data is 2, choose spot color, if 1 choose foreground
          cc.fillStyle =
            imageData[i] === 1 ? opts.color : opts.spotcolor

          cc.fillRect(
            col * opts.scale,
            row * opts.scale,
            opts.scale,
            opts.scale
          )
        }
      }
      return canvas
    }
  }
})
</script>

<style scoped>
.Blockies {
}
</style>
