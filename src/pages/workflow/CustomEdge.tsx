import React, { FC } from 'react'
import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge } from 'reactflow'

export type CustomEdgeData = {
    action?: string
    bypasses?: Array<string>
    isBlocked?: boolean
}

const CustomEdge: FC<EdgeProps<CustomEdgeData>> = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    markerEnd,
    selected,
    style = {},
}) => {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    })
    const action = data?.action ?? ''
    const isBlocked = data?.isBlocked ?? false

    return (
        <>
            {/* <path key={`edge-${id}`} id={id} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} style={{ ...style, stroke: 'red' }} /> */}
            <BaseEdge key={`edge-${id}`} path={edgePath} markerEnd={isBlocked ? '' : markerEnd} style={{ ...style, stroke: isBlocked ? '#ccc' : '#222' }} />
            <EdgeLabelRenderer key={`edge__label-${id}`}>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        background: action ? '#ffcc00' : '#f45757',
                        padding: 5,
                        borderRadius: 5,
                        fontSize: 12,
                        fontWeight: 700,
                        height: 26,
                        textAlign: 'center',
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan"
                >
                    {action}
                </div>
            </EdgeLabelRenderer>
        </>
    )
}

export default CustomEdge