import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { Node, Edge } from 'reactflow'
import { CustomEdgeData } from '../../pages/workflow/CustomEdge'
import { CustomNodeData } from '../../pages/workflow/CustomNode'
import { RootState } from '../rootReducer'

export type Workflow = {
    id: number | undefined
    name: string | undefined
    nodes: Array<Node<CustomNodeData>>
    edges: Array<Edge<CustomEdgeData>>
}

const initialState: Workflow = {
    id: undefined,
    name: undefined,
    nodes: [],
    edges: []
}

export const workflowSlice = createSlice({
    name: 'workflow',
    initialState,
    reducers: {
        setWorkflow: (state, action: PayloadAction<Workflow>) => {
            const payload = action.payload
            state.id = payload.id
            state.name = payload.name
            state.nodes = payload.nodes
            state.edges = payload.edges
        },
    },
})

const selectSelf = (state: RootState) => state
const workflowSelector = createSelector(selectSelf, (state) => state.workflow)

export const { setWorkflow } = workflowSlice.actions
export { workflowSelector }

export default workflowSlice.reducer
