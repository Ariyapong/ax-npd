import React, { useCallback } from 'react'
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    BackgroundVariant,
    ConnectionLineType,
    Node,
    Position,
    MarkerType,
    EdgeTypes,
    Panel,
} from 'reactflow'
import dagre from 'dagre'
import CustomEdge from './CustomEdge'
import CustomEdgeStartEnd from './CustomEdgeStartEnd'
import 'reactflow/dist/style.css'

export { Page }

const position = { x: 0, y: 0 };
const style = {
    strokeWidth: 1.2,
    stroke: '#222',
}
const markerEnd = {
    type: MarkerType.ArrowClosed,
    width: 15,
    height: 15,
    color: '#222',
}
const edgeTypes: EdgeTypes = {
    'custom': CustomEdge,
    'start-end': CustomEdgeStartEnd,
}

export const initialNodes: Array<Node> = [
    { id: '1', data: { label: 'Approved ?', role: 'Admin' }, position },
    { id: '2', data: { label: 'Long long long long long long long message', role: 'Admin' }, position },
    { id: '3', data: { label: '3', role: 'Admin' }, position },
    { id: '4', data: { label: 'Finished', role: 'Admin' }, position },
]

export const initialEdges: Array<Edge> = [
    {
        id: 'e1-2', source: '1', target: '2', style, markerEnd, type: 'custom', data: { output: 'Yes' }
    },
    {
        id: 'e2-3', source: '2', target: '3', style, markerEnd
    },
    {
        id: 'e3-4', source: '3', target: '4', style, markerEnd
    },
    {
        id: 'e1-4', source: '1', target: '4', style, markerEnd, type: 'custom', data: { output: 'No' }
    }
]

function Page() {
    const dagreGraph = new dagre.graphlib.Graph()
    dagreGraph.setDefaultEdgeLabel(() => ({}))

    const nodeWidth = 172
    const nodeHeight = 36

    const getLayoutedElements = (nodes: Array<Node>, edges: Array<Edge>, direction = 'TB') => {
        const isHorizontal = direction === 'LR'
        dagreGraph.setGraph({ rankdir: direction })

        nodes.forEach((node: Node) => {
            dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
        })

        edges.forEach((edge: Edge) => {
            dagreGraph.setEdge(edge.source, edge.target)
        })

        dagre.layout(dagreGraph)

        nodes.forEach((node: Node) => {
            const nodeWithPosition = dagreGraph.node(node.id)
            node.targetPosition = isHorizontal ? Position.Left : Position.Top
            node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom

            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            node.position = {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            };

            return node
        })

        return { nodes, edges }
    }

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialNodes,
        initialEdges
    )
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges)

    const onConnect = useCallback(
        (params: Edge | Connection) =>
            setEdges((eds) =>
                addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: false }, eds)
            ),
        []
    )

    const onLayout = useCallback(
        (direction: string) => {
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                nodes,
                edges,
                direction
            );

            setNodes([...layoutedNodes])
            setEdges([...layoutedEdges])
        },
        [nodes, edges]
    )

    return (
        <div style={{ width: '50rem', height: '80vh' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                edgeTypes={edgeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Panel position="top-right">
                    <button onClick={() => onLayout('TB')}>vertical layout</button>
                    <button onClick={() => onLayout('LR')}>horizontal layout</button>
                </Panel>
                <Controls />
                {/* <MiniMap /> */}
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </div>
    )
}
