import { Edge, MarkerType, Node } from 'reactflow'
import { CustomNodeData } from './CustomNode'
import { getId } from '../../utils'
import { CustomEdgeData } from './CustomEdge'
import { Workflow } from '../../store/workflow'

const position = { x: 0, y: 0 }

const type = 'custom'

export const style = {
    strokeWidth: 1.2,
    stroke: '#222',
}
export const markerEnd = {
    type: MarkerType.ArrowClosed,
    width: 15,
    height: 15,
    color: '#222',
}

export const initialNodes: Array<Node<CustomNodeData>> = [
    { id: getId(), type: 'custom', position, data: { label: 'Start', roles: ['Admin'] } },
]

export const initialEdges: Array<Edge<CustomEdgeData>> = []

export const workflowNodes: Array<Node<CustomNodeData>> = [
    { id: '1', type: 'custom', position, data: { label: 'Start', roles: ['Admin'] } },
    { id: '2', type: 'custom', position, data: { label: 'Product Request', roles: ['Admin'] } },
    { id: '3', type: 'custom', position, data: { label: 'Charter Gate', roles: ['Admin'], leadTime: 3, type: 'gate' } },
    { id: '4', type: 'custom', position, data: { label: 'Prototype Taste Draft Cost and Price', roles: ['Admin'], leadTime: 5 } },
    { id: '5', type: 'custom', position, data: { label: 'Packaging Prototype', roles: ['Admin'], leadTime: 5 } },
    { id: '6', type: 'custom', position, data: { label: 'Sales Projection', roles: ['Admin'], bypasses: ['A', 'B'], leadTime: 5 } },
    { id: '7', type: 'custom', position, data: { label: 'Contract Gate', roles: ['Admin'], leadTime: 5, type: 'gate' }, },
    { id: '8', type: 'custom', position, data: { label: 'Condition Check', roles: ['Admin'], bypasses: ['A'], leadTime: 5 } },
    { id: '9', type: 'custom', position, data: { label: 'Regulatory Process', roles: ['Admin'], leadTime: 5 } },
    { id: '10', type: 'custom', position, data: { label: 'New Product Item Request', roles: ['Admin'], leadTime: 5 } },
    { id: '11', type: 'custom', position, data: { label: 'Final Cost and Price', roles: ['Admin'], leadTime: 5 } },
    { id: '12', type: 'custom', position, data: { label: 'Final Packaging Trial', roles: ['Admin'], leadTime: 5, subflow: 2 } },
    { id: '13', type: 'custom', position, data: { label: 'Condition Check 1', roles: ['Admin'], leadTime: 5 } },
]

export const workflowEdges: Array<Edge<CustomEdgeData>> = [
    {
        id: 'e1-2', source: '1', target: '2', style, markerEnd, type, data: { action: 'Yes' }
    },
    {
        id: 'e2-3', source: '2', target: '3', style, markerEnd, type
    },
    {
        id: 'e3-4', source: '3', target: '4', style, markerEnd, type, data: { action: 'A' }
    },
    {
        id: 'e3-5', source: '3', target: '5', style, markerEnd, type, data: { action: 'B' }
    },
    {
        id: 'e3-7', source: '3', target: '7', style, markerEnd, type, data: { action: 'C' }
    },
    {
        id: 'e4-6', source: '4', target: '6', style, markerEnd, type
    },
    {
        id: 'e5-7', source: '5', target: '7', style, markerEnd, type
    },
    {
        id: 'e6-7', source: '6', target: '7', style, markerEnd, type
    },
    {
        id: 'e7-8', source: '7', target: '8', style, markerEnd, type
    },
    {
        id: 'e8-9', source: '8', target: '9', style, markerEnd, type, data: { action: 'A' }
    },
    {
        id: 'e8-10', source: '8', target: '10', style, markerEnd, type, data: { action: 'B', bypasses: ['A'] }
    },
    {
        id: 'e8-11', source: '8', target: '11', style, markerEnd, type, data: { action: 'C' }
    },
    {
        id: 'e8-12', source: '8', target: '12', style, markerEnd, type, data: { action: 'D' }
    },
    {
        id: 'e11-13', source: '11', target: '13', style, markerEnd, type
    },
    {
        id: 'e10-13', source: '10', target: '13', style, markerEnd, type
    },
    {
        id: 'e12-13', source: '12', target: '13', style, markerEnd, type
    },
]

export const subflowNodes: Array<Node<CustomNodeData>> = [
    { id: '1', type: 'custom', position, data: { label: 'Start', roles: ['Admin'] } },
    { id: '2', type: 'custom', position, data: { label: 'Regulatory Process', roles: ['Admin'] } },
    { id: '3', type: 'custom', position, data: { label: 'Charter Gate', roles: ['Admin'], leadTime: 3, type: 'gate' } },
    { id: '4', type: 'custom', position, data: { label: 'End', roles: ['Admin'], leadTime: 5 } },
]

export const subflowEdges: Array<Edge<CustomEdgeData>> = [
    {
        id: 'e1-2', source: '1', target: '2', style, markerEnd, type, data: {}
    },
    {
        id: 'e2-3', source: '2', target: '3', style, markerEnd, type, data: {}
    },
    {
        id: 'e3-4', source: '3', target: '4', style, markerEnd, type, data: {}
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