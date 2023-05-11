import React, { memo, ReactNode } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import './index.scss'

export type CustomNodeData = {
    title?: string
    icon?: ReactNode
    subline?: string
    label?: string
    roles?: Array<string>
    weeks?: number
}

export default memo(({ data }: NodeProps<CustomNodeData>) => {
    return (
        <>
            <div className="wrapper">
                {data.weeks &&
                    <div className="weeks">
                        <div>{data.weeks}</div>
                    </div>
                }
                <div className="inner">
                    <Handle type="target" position={Position.Top} />
                    {data.icon && <div className="icon">{data.icon}</div>}
                    {data.label}
                    <Handle type="source" position={Position.Bottom} />
                </div>
            </div>
        </>
    )
})