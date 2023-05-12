import React, { FC } from 'react'
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from 'reactflow'

export type CustomEdgeData = {
    action?: string
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

    return (
        <>
            <path id={id} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} style={style} />
            <EdgeLabelRenderer>
                {data?.action ?
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            background: '#ffcc00',
                            padding: 5,
                            borderRadius: 5,
                            fontSize: 12,
                            fontWeight: 700,
                            height: 26
                        }}
                        className="nodrag nopan"
                    >
                        {data.action}
                    </div>
                    :
                    null
                }
            </EdgeLabelRenderer>
        </>
    )
}

export default CustomEdge