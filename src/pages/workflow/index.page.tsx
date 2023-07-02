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
import { Workflow, setSelectedEdge, setSelectedEdgeLabel, setSelectedNode, setSelectedNodeLabel, setSelectedNodeType, setWorkflow, workflowSelector } from '@/store/workflow'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/rootReducer'
import { deepClone, getId } from '@/utils'
import { markerEnd, style, workflow1, workflow2 } from './workflow'
import 'reactflow/dist/style.css'
import { usePageContext } from '../../../renderer/usePageContext'

export { Page }

const nodeTypes: NodeTypes = {
    'custom': CustomNode
}
const edgeTypes: EdgeTypes = {
    'custom': CustomEdge,
    // 'start-end': CustomEdgeStartEnd,
}

type DirectionType = 'TB' | 'LR'

const getLayoutedElements = (dagreGraph: dagre.graphlib.Graph<{}>, workflow: Workflow, direction: DirectionType = 'TB') => {
    const nodeWidth = 120
    const nodeHeight = 50
    const isHorizontal = direction === 'LR'
    const nodes = workflow.nodes
    const edges = workflow.edges
    dagreGraph.setGraph({ rankdir: direction })

    nodes.forEach((node: Node) => {
        dagreGraph.setNode(node.id, {
            width: node.width || nodeWidth,
            height: node.height || nodeHeight
        })
    })

    edges.forEach((edge: Edge) => {
        dagreGraph.setEdge(edge.source, edge.target)
    })

    dagre.layout(dagreGraph)

    nodes.forEach((node: Node<CustomNodeData>) => {
        const nodeWithPosition = dagreGraph.node(node.id)
        node.targetPosition = isHorizontal ? Position.Left : Position.Top
        node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom
        node.position = {
            x: node.position.x || nodeWithPosition.x - (nodeWidth / 2),
            y: node.position.y || nodeWithPosition.y - (nodeHeight / 2),
        };

        return node
    })

    edges.forEach((edge) => {
        const source = edge.source
        const target = edge.target
        const targetNode = nodes.find((node) => node.id === target)
        if (targetNode) {
            targetNode.data = {
                ...targetNode.data,
                precedents: [...new Set(targetNode.data.precedents).add(source)]
            }
        }
    })

    return { nodes, edges }
}

const WorkflowDiagram = ({ workflow }: { workflow: Workflow }) => {
    const dagreGraph = new dagre.graphlib.Graph()
    dagreGraph.setDefaultEdgeLabel(() => ({}))

    const dispatch = useDispatch()
    const reactFlowWrapper = useRef<HTMLDivElement>(null)
    const sourceNodeId = useRef<string | null>(null)
    const targetNodeId = useRef<string | null>(null)
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance<CustomNodeData, CustomEdgeData>>()
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(dagreGraph, workflow)
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges)
    const { setViewport } = useReactFlow()
    const { project } = useReactFlow()
    const { selectedNode, selectedEdge } = useSelector((state: RootState) => state.workflow)

    const onConnect: OnConnect = useCallback((params) => {
        targetNodeId.current = params.target
        // const newEdge = { ...params, type: 'custom', style, markerEnd }
        // setEdges((eds) => addEdge(newEdge, eds))
    }, [])

    const onConnectStart: OnConnectStart = useCallback((_event, { nodeId }) => {
        sourceNodeId.current = nodeId
    }, [])

    const onConnectEnd: OnConnectEnd = useCallback((event) => {
        const source = sourceNodeId.current
        if (source) {
            const target = event.target as HTMLElement
            const targetIsPane = target?.classList.contains('react-flow__pane')

            let newNode = undefined as unknown as Node<CustomNodeData>
            const id = getId()
            const newEdge = {
                id,
                type: 'custom',
                source,
                style,
                markerEnd
            } as Edge

            if (targetIsPane) {
                const { top, left } = reactFlowWrapper.current?.getBoundingClientRect() as DOMRect
                newNode = {
                    id,
                    type: 'custom',
                    // Half of the node width defined in .react-flow__node-custom (150/2 = 75) to center the new node
                    position: project({ x: (event as unknown as MouseEvent).clientX - left - 75, y: (event as unknown as MouseEvent).clientY - top }),
                    data: {
                        label: `New ${id}`,
                        precedents: [source]
                    },
                    targetPosition: Position.Top,
                    sourcePosition: Position.Bottom,
                }
                newEdge.target = id

                setNodes((nds) => nds.concat(newNode))
                setEdges((eds) => eds.concat(newEdge))
            } else {
                if (targetNodeId.current) {
                    newEdge.target = targetNodeId.current
                    setEdges((eds) => eds.concat(newEdge))
                }
            }
            console.log(nodes)
        }
    }, [project])

    const save = (): void => {
        if (rfInstance) {
            const flow = rfInstance.toObject()
            console.log(JSON.stringify(flow, null, 2))
            dispatch(setWorkflow({
                ...workflow,
                nodes: flow.nodes,
                edges: flow.edges,
            }))
            console.log('Saved!!!')
        }
    }

    const onSave: MouseEventHandler = useCallback(() => {
        save()
    }, [rfInstance])

    const onChange: React.FormEventHandler<HTMLDivElement> | undefined = useCallback(() => {
        // console.log('Changed')
    }, [])

    const onNodeClick: NodeMouseHandler = useCallback((_event, node: Node<CustomNodeData>) => {
        save()
        dispatch(setSelectedNode(node.id))
        dispatch(setSelectedEdge(null))
        if (node.data.subflow) {
            setViewport({ x: 50, y: 50, zoom: 1 })
            dispatch(setWorkflow(workflow2))
        }
    }, [rfInstance])

    const onEdgeClick = useCallback((_event: React.MouseEvent<Element, MouseEvent>, edge: Edge<CustomEdgeData>) => {
        save()
        dispatch(setSelectedEdge(edge.id))
        dispatch(setSelectedNode(null))
    }, [rfInstance])

    useEffect(() => {
        setViewport({ x: 50, y: 50, zoom: 1 })
    }, [])

    useEffect(() => {
        setNodes(workflow.nodes)
        setEdges(workflow.edges)
        const icx = document.querySelector('.react-flow__panel.react-flow__attribution.bottom.right')
        icx?.remove()
    }, [workflow])

    useEffect(() => {
        setNodes((nds) =>
            nds.map((node) => {
                if (selectedNode && selectedNode.id && node.id === selectedNode.id) {
                    node.data = {
                        ...node.data,
                        label: selectedNode.data.label,
                        type: selectedNode.data.type,
                    }
                }
                return node
            })
        )
    }, [selectedNode])

    useEffect(() => {
        setEdges((edges) =>
            edges.map((edge) => {
                if (selectedEdge && selectedEdge.id && edge.id === selectedEdge.id) {
                    edge.data = {
                        ...edge.data,
                        action: selectedEdge.data?.action
                    }
                }
                return edge
            })
        )
    }, [selectedEdge])

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
                onChange={onChange}
                onInit={setRfInstance}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                zoomOnScroll={false}
                fitView={false}
            >
                <Panel position="top-right">
                    <button className="button" onClick={onSave}>Save</button>
                    {/* <button onClick={() => onLayout('TB')}>vertical layout</button>
                    <button onClick={() => onLayout('LR')}>horizontal layout</button> */}
                    <div className="updatenode__controls">
                        <label><strong>Node Type {selectedNode?.data.type}</strong></label>
                        <input value={selectedNode?.data.type ?? ''} onChange={(evt) => dispatch(setSelectedNodeType(evt.target.value as any))} />
                        <label><strong>Node Label</strong></label>
                        <input value={selectedNode?.data.label ?? ''} onChange={(evt) => dispatch(setSelectedNodeLabel(evt.target.value))} />
                        <label><strong>Edge Label</strong></label>
                        <input value={selectedEdge?.data?.action ?? ''} onChange={(evt) => dispatch(setSelectedEdgeLabel(evt.target.value))} />
                    </div>
                </Panel>
                {/* <Controls /> */}
                {/* <MiniMap /> */}
                {/* <Background variant={BackgroundVariant.Dots} gap={12} size={1} /> */}
            </ReactFlow>
        </div>
    )
}

function Page() {
    const { urlParsed } = usePageContext()
    const dispatch = useDispatch()
    const state = useSelector((state: RootState) => state)
    const workflow = workflowSelector(state)

    useEffect(() => {
        dispatch(setWorkflow(workflow1))
    }, [])

    const copyWorkflow = (): Workflow => {
        return deepClone(workflow)
    }

    const setupWorkflow = (): Workflow => {
        let strConditions = urlParsed?.search.conditions
        const conditions = strConditions?.split(',')
        const workflow = copyWorkflow()
        const nodes = workflow.nodes
        const edges = workflow.edges
        const bypassNodes = new Set<string>()
        const blockEdges = new Set<string>()

        nodes.map((node) => {
            const bypasses = node.data.bypasses
            if (bypasses?.some((bypass) => conditions?.includes(bypass))) {
                node.data.isSkipped = true
                bypassNodes.add(node.id)
            }
        })

        bypassNodes.forEach((nodeId) => {
            const filteredEdges = edges.filter((edge) => edge.source === nodeId)
            if (filteredEdges.length > 1) {
                filteredEdges.forEach((edge) => {
                    const bypasses = edge.data?.bypasses
                    if (!bypasses?.some((bypass) => conditions?.includes(bypass))) {
                        blockEdges.add(edge.id)
                    }
                })
            }
        })

        edges.map((edge) => {
            if (blockEdges.has(edge.id)) {
                edge.data = {
                    ...edge.data,
                    isBlocked: true
                }
            }
        })
        return workflow
    }

    return (
        <div style={{ width: '60rem', height: '100vh', border: '1px dotted #ccc' }}>
            <ReactFlowProvider>
                <WorkflowDiagram workflow={setupWorkflow()} />
            </ReactFlowProvider>
        </div>
    )
}
