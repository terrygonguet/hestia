import Vue from "vue"
import { ThisTypedComponentOptionsWithRecordProps } from "vue/types/options"
import { Config } from "./store"

const template = `
<div
  class="rounded border border-main bg-block overflow-hidden relative"
  :style="gridSpan"
>
  <canvas ref="canvas" class="absolute top-0 left-0">
    Your browser is old
  </canvas>
</div>`

export interface Clock {
  type: "Clock"
  id: string
  width: number
  height: number
  code: string
}

type Props = {
  id: string
  width: number
  height: number
  code: string
}
type Data = {
  dateFormatter: Intl.DateTimeFormat
}
type Methods = {
  setCanvasDimentions(): void
}
type Computed = {
  gridSpan: object
  canvas: HTMLCanvasElement | null
  context: CanvasRenderingContext2D | null
}

const component: ThisTypedComponentOptionsWithRecordProps<
  Vue,
  Data,
  Methods,
  Computed,
  Props
> = {
  name: "Clock",
  props: {
    id: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: 1,
    },
    height: {
      type: Number,
      default: 1,
    },
    code: {
      type: String,
      default: "",
    },
  },
  template,
  data() {
    return {
      dateFormatter: new Intl.DateTimeFormat("default", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
    }
  },
  computed: {
    gridSpan() {
      return {
        "grid-column": "span " + this.width,
        "grid-row": "span " + this.height,
      }
    },
    canvas() {
      return (this.$refs.canvas as HTMLCanvasElement) || null
    },
    context() {
      return this.canvas ? this.canvas.getContext("2d") : null
    },
  },
  methods: {
    setCanvasDimentions() {
      let canvas = this.$refs.canvas as HTMLCanvasElement | undefined
      let el = this.$el
      if (canvas && el) {
        canvas.width = el.clientWidth
        canvas.height = el.clientHeight
      }
    },
  },
  watch: {
    async width() {
      await this.$nextTick()
      this.setCanvasDimentions()
    },
    async height() {
      await this.$nextTick()
      this.setCanvasDimentions()
    },
  },
  async mounted() {
    this.setCanvasDimentions()
    await this.$nextTick()
    try {
      let fn = new Function("canvas", "ctx", "colors", this.code)
      let config: Config = this.$store.state.config
      let colors: { [name: string]: string } = {
        main: config.colorMain,
        accent: config.colorAccent,
        bg: config.colorBg,
        block: config.colorBgBlock,
        border: config.colorBorder,
      }
      fn(this.canvas, this.context, colors)
    } catch (err) {
      console.error(err)
    }
  },
}

export default component

export function create(): Clock {
  return {
    type: "Clock",
    id: Date.now()
      .toString(36)
      .substr(2),
    height: 1,
    width: 1,
    code: `/*
  available globals :
  - canvas - the canvas element
  - ctx    - the CanvasRenderingContext2D
  - colors - an object containing the colors of the interface
*/

function draw() {
  let w = canvas.width, h = canvas.height
  let center = [w/2, h/2], vmin = Math.min(...center)
  let now = new Date(), sec = now.getSeconds() + now.getMilliseconds() / 1000
  let min = now.getMinutes() + sec / 60, hour = now.getHours() + min / 60
  let tau = 2 * Math.PI

  // compute the positions of the numbers along the circle
  let numbers = Array(12).fill(null).map((_, i) => {
    let a = -Math.PI / 2 + i * tau / 12
    return [Math.cos(a) * 0.8 * vmin, Math.sin(a) * 0.8 * vmin]
  })

  // helper to draw the hands of the clock
  function drawHand(length, width, angle) {
    ctx.save()
    ctx.lineWidth = width
    ctx.beginPath()
    ctx.rotate(angle)
    ctx.moveTo(0, 0)
    ctx.lineTo(0, -length)
    ctx.stroke()
    ctx.restore()
  }

  // save the default state, clear canvas and set defaults
  ctx.save()
  ctx.clearRect(0,0,w,h)
  ctx.translate(...center)
  ctx.strokeStyle = colors.main
  ctx.fillStyle = colors.accent
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  // draw the numbers
  numbers.forEach((point, i) => ctx.fillText(i ? i : 12, ...point))

  drawHand(0.6 * vmin, 5, hour / 12 * tau)
  drawHand(0.7 * vmin, 4, min / 60 * tau)
  drawHand(0.8 * vmin, 2, sec / 60* tau)

  // draw a circle at the center
  ctx.save()
  ctx.beginPath()
  ctx.arc(0, 0, 5, 0, tau)
  ctx.fill()
  ctx.restore()

  // draw the containing circle
  ctx.save()
  ctx.beginPath()
  ctx.strokeStyle = colors.border
  ctx.arc(0, 0, 0.9 * vmin, 0, tau)
  ctx.stroke()
  ctx.restore()

  // restore default state and request next animation frame
  ctx.restore()
  requestAnimationFrame(draw)
}

// start the RAF loop
draw()
`,
  }
}
