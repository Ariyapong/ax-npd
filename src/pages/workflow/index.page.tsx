import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Edge,
    BackgroundVariant,
    ConnectionLineType,
    Node,
    Position,
    MarkerType,
    EdgeTypes,
    Panel,
    NodeTypes,
    ReactFlowProvider,
    useReactFlow,
    ReactFlowInstance,
    NodeMouseHandler,
    OnConnectEnd,
    OnConnectStart,
    OnConnect,
} from 'reactflow'
import dagre from 'dagre'
import CustomNode, { CustomNodeData } from './CustomNode'
import CustomEdge, { CustomEdgeData } from './CustomEdge'
import CustomEdgeStartEnd from './CustomEdgeStartEnd'
import { nanoid } from 'nanoid'
import { Workflow, setWorkflow, workflowSelector } from '../../store/workflow'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'
import { deepClone } from '../../utils'
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
const nodeTypes: NodeTypes = {
    'custom': CustomNode
}
const edgeTypes: EdgeTypes = {
    'custom': CustomEdge,
    'start-end': CustomEdgeStartEnd,
}

export const workflowNodes: Array<Node<CustomNodeData>> = [
    { id: '1', type: 'custom', position, data: { label: 'Start', roles: ['Admin'] } },
    { id: '2', type: 'custom', position, data: { label: 'Product Request', roles: ['Admin'] } },
    { id: '3', type: 'custom', position, data: { label: 'Charter Gate', roles: ['Admin'], weeks: 3, type: 'gate' } },
    { id: '4', type: 'custom', position, data: { label: 'Prototype Taste Draft Cost and Price', roles: ['Admin'], weeks: 5 } },
    { id: '5', type: 'custom', position, data: { label: 'Packaging Prototype', roles: ['Admin'], weeks: 5 } },
    { id: '6', type: 'custom', position, data: { label: 'Sales Projection', roles: ['Admin'], weeks: 5 } },
    { id: '7', type: 'custom', position, data: { label: 'Contract Gate', roles: ['Admin'], weeks: 5, type: 'gate' }, },
    { id: '8', type: 'custom', position, data: { label: 'Condition Check', roles: ['Admin'], weeks: 5 } },
    { id: '9', type: 'custom', position, data: { label: 'Regulatory Process', roles: ['Admin'], weeks: 5 } },
    { id: '10', type: 'custom', position, data: { label: 'New Product Item Request', roles: ['Admin'], weeks: 5 } },
    { id: '11', type: 'custom', position, data: { label: 'Final Cost and Price', roles: ['Admin'], weeks: 5 } },
    { id: '12', type: 'custom', position, data: { label: 'Final Packaging Trial', roles: ['Admin'], weeks: 5, subflow: 2 } },
    { id: '13', type: 'custom', position, data: { label: 'Condition Check 1', roles: ['Admin'], weeks: 5 } },
]

export const workflowEdges: Array<Edge<CustomEdgeData>> = [
    {
        id: 'e1-2', source: '1', target: '2', style, markerEnd, type: 'custom', data: { action: 'Yes' }
    },
    {
        id: 'e2-3', source: '2', target: '3', style, markerEnd
    },
    {
        id: 'e3-4', source: '3', target: '4', style, markerEnd, type: 'custom', data: { action: 'A' }
    },
    {
        id: 'e3-5', source: '3', target: '5', style, markerEnd, type: 'custom', data: { action: 'B' }
    },
    {
        id: 'e3-7', source: '3', target: '7', style, markerEnd, type: 'custom', data: { action: 'C' }
    },
    {
        id: 'e4-6', source: '4', target: '6', style, markerEnd
    },
    {
        id: 'e5-7', source: '5', target: '7', style, markerEnd
    },
    {
        id: 'e6-7', source: '6', target: '7', style, markerEnd
    },
    {
        id: 'e7-8', source: '7', target: '8', style, markerEnd
    },
    {
        id: 'e8-9', source: '8', target: '9', style, markerEnd, type: 'custom', data: { action: 'A' }
    },
    {
        id: 'e8-10', source: '8', target: '10', style, markerEnd, type: 'custom', data: { action: 'B' }
    },
    {
        id: 'e8-11', source: '8', target: '11', style, markerEnd, type: 'custom', data: { action: 'C' }
    },
    {
        id: 'e8-12', source: '8', target: '12', style, markerEnd, type: 'custom', data: { action: 'D' }
    },
    {
        id: 'e11-13', source: '11', target: '13', style, markerEnd
    },
    {
        id: 'e10-13', source: '10', target: '13', style, markerEnd
    },
    {
        id: 'e12-13', source: '12', target: '13', style, markerEnd
    },
]

export const subflowNodes: Array<Node<CustomNodeData>> = [
    { id: '1', type: 'custom', position, data: { label: 'Start', roles: ['Admin'] } },
    { id: '2', type: 'custom', position, data: { label: 'Regulatory Process', roles: ['Admin'] } },
    { id: '3', type: 'custom', position, data: { label: 'Charter Gate', roles: ['Admin'], weeks: 3, type: 'gate' } },
    { id: '4', type: 'custom', position, data: { label: 'End', roles: ['Admin'], weeks: 5 } },
]

export const subflowEdges: Array<Edge<CustomEdgeData>> = [
    {
        id: 'e1-2', source: '1', target: '2', style, markerEnd, type: 'custom', data: {}
    },
    {
        id: 'e2-3', source: '2', target: '3', style, markerEnd, type: 'custom', data: {}
    },
    {
        id: 'e3-4', source: '3', target: '4', style, markerEnd, type: 'custom', data: {}
    },
]

export const workflow1: Workflow = {
    id: 1,
    name: 'Sample 1',
    nodes: workflowNodes,
    edges: workflowEdges,
}

export const workflow2: Workflow = {
    id: 2,
    name: 'Subflow 1',
    nodes: subflowNodes,
    edges: subflowEdges,
}

// let id = Number(workflowNodes.pop()?.id)
const getId = () => nanoid(10)

const getLayoutedElements = (dagreGraph: dagre.graphlib.Graph<{}>, workflow: Workflow, direction = 'TB') => {
    const nodeWidth = 120
    const nodeHeight = 50
    const isHorizontal = direction === 'LR'
    const nodes = workflow.nodes
    const edges = workflow.edges
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
            x: nodeWithPosition.x - (nodeWidth / 2),
            y: nodeWithPosition.y - (nodeHeight / 2),
        };

        return node
    })

    return { nodes, edges }
}

const AddNodeOnEdgeDrop = ({ workflow }: { workflow: Workflow }) => {
    console.log('AddNodeOnEdgeDrop')
    const dagreGraph = new dagre.graphlib.Graph()
    dagreGraph.setDefaultEdgeLabel(() => ({}))

    const dispatch = useDispatch()
    const reactFlowWrapper = useRef<HTMLDivElement>(null)
    const connectingNodeId = useRef<string | null>(null)
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance<CustomNodeData, CustomEdgeData>>()
    const [selectedNodeLabel, setSelectedNodeLabel] = useState<string>('')
    const [selectedNodeId, setSelectedNodeId] = useState<string>('')
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(dagreGraph, workflow)
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges)
    const { setViewport } = useReactFlow()
    const { project } = useReactFlow()

    const onConnect: OnConnect = useCallback((params) => {
        setEdges((eds) =>
            addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: false }, eds)
        )
    }, [])

    const onConnectStart: OnConnectStart = useCallback((_event, { nodeId }) => {
        connectingNodeId.current = nodeId
    }, [])

    const onConnectEnd: OnConnectEnd = useCallback((event) => {
        if (connectingNodeId.current) {
            const target = event.target as HTMLElement
            const targetIsPane = target?.classList.contains('react-flow__pane')

            if (targetIsPane) {
                const { top, left } = reactFlowWrapper.current?.getBoundingClientRect() as DOMRect
                const id = getId()
                const newNode = {
                    id,
                    type: 'custom',
                    // Half of the node width defined in .react-flow__node-custom (150/2 = 75) to center the new node
                    position: project({ x: (event as MouseEvent).clientX - left - 75, y: (event as MouseEvent).clientY - top }),
                    data: { label: `Node ${id}` },
                }
                const newEdge = {
                    id,
                    source: connectingNodeId.current,
                    target: id,
                    style,
                    markerEnd
                }

                setNodes((nds) => nds.concat(newNode))
                setEdges((eds) => eds.concat(newEdge))
            }
        }
    }, [project])

    const onSave: MouseEventHandler = useCallback(() => {
        if (rfInstance) {
            const flow = rfInstance.toObject()
            console.log(JSON.stringify(flow, null, 2))
        }
    }, [rfInstance])

    const onNodeClick: NodeMouseHandler = useCallback((_event, node: Node<CustomNodeData>) => {
        setSelectedNodeId(node.id)
        setSelectedNodeLabel(node.data.label || '')
        if (node.data.subflow) {
            dispatch(setWorkflow(workflow2))
        }
    }, [])

    useEffect(() => {
        console.log('@')
        setViewport({ x: 0, y: 0, zoom: 1 })
        setNodes(workflow.nodes)
        setEdges(workflow.edges)
    }, [workflow])

    useEffect(() => {
        console.log('#')
        setNodes((nds) =>
            nds.map((node) => {
                if (selectedNodeId && node.id === selectedNodeId) {
                    // when you update a simple type you can just update the value
                    node.data = {
                        ...node.data,
                        label: selectedNodeLabel
                    }
                }
                return node
            })
        )
    }, [selectedNodeLabel])

    // const onLayout = useCallback(
    //     (direction: string) => {
    //         const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    //             nodes,
    //             edges,
    //             direction
    //         );

    //         setNodes([...layoutedNodes])
    //         setEdges([...layoutedEdges])
    //     },
    //     [nodes, edges]
    // )

    return (

        <div style={{ flexGrow: 1, height: '100%' }} ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectEnd}
                onInit={setRfInstance}
                onNodeClick={onNodeClick}
                zoomOnScroll={false}
                fitView={false}
            >
                <Panel position="top-right">
                    <button onClick={onSave}>Save</button>
                    {/* <button onClick={() => onLayout('TB')}>vertical layout</button>
                    <button onClick={() => onLayout('LR')}>horizontal layout</button> */}
                    <div className="updatenode__controls">
                        <label>label: </label><input value={selectedNodeLabel} onChange={(evt) => setSelectedNodeLabel(evt.target.value)} />
                    </div>
                </Panel>
                <Controls />
                {/* <MiniMap /> */}
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </div>
    )
}

function Page() {
    const dispatch = useDispatch()
    const state = useSelector((state: RootState) => state)
    const workflow = workflowSelector(state)

    useEffect(() => {
        console.log('Page')
        dispatch(setWorkflow(workflow1))
    }, [])

    const getWorkflow = () => {
        return deepClone(workflow)
    }

    return (
        <div style={{ width: '50rem', height: '100vh' }}>
            <ReactFlowProvider>
                <AddNodeOnEdgeDrop workflow={getWorkflow()} />
            </ReactFlowProvider>
        </div>
    )
}
