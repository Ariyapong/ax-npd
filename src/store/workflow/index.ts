// import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import * as toolkitRaw from '@reduxjs/toolkit'
import { Node, Edge } from 'reactflow'
import { CustomEdgeData } from '@/pages/workflow/CustomEdge'
import { CustomNodeData, NodeType } from '@/pages/workflow/CustomNode'
import { RootState } from '../rootReducer'

const { createSlice, createSelector } = ((toolkitRaw as any).default ?? toolkitRaw) as typeof toolkitRaw

export type Workflow = {
    id?: number
    name?: string
    nodes: Array<Node<CustomNodeData>>
    edges: Array<Edge<CustomEdgeData>>
    selectedNode?: Node<CustomNodeData>
    selectedEdge?: Edge<CustomEdgeData>
}

const initialState: Workflow = {
    id: undefined,
    name: undefined,
    nodes: [],
    edges: [],
}

export const workflowSlice = createSlice({
    name: 'workflow',
    initialState,
    reducers: {
        setWorkflow: (state, action: toolkitRaw.PayloadAction<Workflow>) => {
            const payload = action.payload
            state.id = payload.id ?? state.id
            state.name = payload.name ?? state.name
            state.nodes = payload.nodes
            state.edges = payload.edges
            state.selectedNode = undefined
            state.selectedEdge = undefined
        },
        setSelectedNode: (state, action: toolkitRaw.PayloadAction<Optional<string>>) => {
            const nodeId = action.payload
            if (nodeId) {
                const selectedNode = state.nodes.find((node) => node.id === nodeId)
                state.selectedNode = selectedNode
            } else {
                state.selectedNode = undefined
            }
        },
        setSelectedNodeType: (state, action: toolkitRaw.PayloadAction<NodeType>) => {
            if (state.selectedNode) {
                state.selectedNode.data.type = action.payload
                state.nodes.map(node => {
                    if (node.id === state.selectedNode!.id) {
                        node = state.selectedNode!
                    }
                })
            }
        },
        setSelectedNodeLabel: (state, action: toolkitRaw.PayloadAction<string>) => {
            if (state.selectedNode) {
                state.selectedNode.data.label = action.payload
                state.nodes.map(node => {
                    if (node.id === state.selectedNode!.id) {
                        node = state.selectedNode!
                    }
                })
            }
        },
        setSelectedEdge: (state, action: toolkitRaw.PayloadAction<Optional<string>>) => {
            const edgeId = action.payload
            if (edgeId) {
                const selectedEdge = state.edges.find((edge) => edge.id === edgeId)
                state.selectedEdge = selectedEdge
            } else {
                state.selectedEdge = undefined
            }
        },
        setSelectedEdgeLabel: (state, action: toolkitRaw.PayloadAction<string>) => {
            if (state.selectedEdge) {
                state.selectedEdge.data = {
                    ...state.selectedEdge.data,
                    action: action.payload
                }
                state.edges.map(edge => {
                    if (edge.id === state.selectedEdge!.id) {
                        edge = state.selectedEdge!
                    }
                })
            }
        }
    },
})

const selectSelf = (state: RootState) => state
const workflowSelector = createSelector(selectSelf, (state) => state.workflow)

export const { setWorkflow, setSelectedNode, setSelectedNodeType, setSelectedNodeLabel, setSelectedEdge, setSelectedEdgeLabel } = workflowSlice.actions
export { workflowSelector }

export default workflowSlice.reducer
