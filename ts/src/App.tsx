import './App.css'
import { createNetwork, countParameters, getWeight, getBias } from './network/network'
import { useRef, useEffect, useState } from 'react'

function App() {
  const [seed, setSeed] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const layers2 = [3, 4, 1]
  const net = createNetwork(layers2)
  const rect = { x: 0, y: 0, width: 800, height: 400 }
  let lineColor = 'green'


  console.log('expected:', countParameters(net.layers))
  console.log('actual:', net.weights.length + net.biases.length)
  console.table(net)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(rect.x, rect.y, rect.width, rect.height)      // wipe
    for (let layer = 0; layer < net.layers.length - 1; layer++) {
      for (let node = 0; node < net.layers[layer+1]; node++) {
        for (let fromNode = 0; fromNode < net.layers[layer]; fromNode++) {
          ctx.beginPath()
          const from = nodePos(layer, fromNode)
          const to = nodePos(layer + 1, node)
          let lineWidth = getWeight(net,layer+1,node, fromNode)
          if(lineWidth<0) lineColor = 'red' 
          else lineColor = 'blue'
          lineWidth = (Math.abs(lineWidth)*4)+1
          ctx.moveTo(from.x, from.y )
          ctx.lineTo(to.x, to.y )
          ctx.strokeStyle = lineColor
          ctx.lineWidth = lineWidth
          ctx.stroke()                        // draws the line
        }
      }
    }
    for (let layer = 0; layer < net.layers.length; layer++) {
      for (let node = 0; node < net.layers[layer]; node++) {
          ctx.beginPath() 
          let from = nodePos(layer, node)
          let to = nodePos(layer, node)
          let radius = 8
          let nodeColor = 'black'

          if(layer>0) {
            from = nodePos(layer, node)
            to = nodePos(layer, node)
            radius = getBias(net,layer,node)
            if(radius<0) nodeColor = 'red' 
            else nodeColor = 'blue'
            radius = (Math.abs(radius)*15)+5
          }
          ctx.arc(from.x, to.y, radius, 0, Math.PI * 2)
          ctx.fillStyle = nodeColor
          ctx.fill()                          // filled circle                   // draws the line
      }
    }


    // drawing code goes here

    function nodePos(layer: number, node: number ) : { x: number, y: number }
    {
      const w = rect.width / (net.layers.length + 1)
      const h = rect.height / (net.layers[layer] + 1)
      const x = (layer + 1) * w
      const y = (node + 1) * h
      return { x, y }
    }

  }, [net])

  return (
    <div>
      <button onClick={() => setSeed(seed + 1)}>New Network</button>
      
      <canvas ref={canvasRef} width={rect.width} height={rect.height} />
    </div>
  )

}

export default App 
