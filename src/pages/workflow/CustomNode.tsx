import React, { memo, ReactNode } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import FunctionIcon from './FunctionIcon'
import './index.scss'

export type NodeType = 'gate' | 'wait'

export type CustomNodeData = {
    title?: string
    icon?: ReactNode
    subline?: string
    label?: string
    roles?: Array<string>
    bypasses?: Array<string>
    leadTime?: number
    type?: NodeType
    subflow?: number
    isSkipped?: boolean
    precedents?: Array<string>
    arrivals?: Array<string>
}

export default memo(({ data }: NodeProps<CustomNodeData>) => {
    const isSkipped = data.isSkipped ?? false

    return (
        <>
            <div className={`wrapper${isSkipped ? ' skip' : ''}`}>
                <>
                    {data.type !== 'wait' && data.leadTime && !isSkipped &&
                        (<div className="lead-time">
                            <div>{data.leadTime}</div>
                        </div>)
                    }
                    <div data-label={data.label}
                        className={`inner
                            ${data.subflow ? ' has-subflow' : ''}
                            ${data.type === 'gate' ? ' gate' : ''}
                            ${data.type === 'wait' ? ' wait' : ''}`
                        }>
                        <Handle type="target" position={Position.Top} />
                        {data.type === 'gate' && <div className="icon"><FunctionIcon /></div>}
                        <Handle type="source" position={Position.Bottom} />
                    </div>
                </>
                {/* <div className="gate">
                    <Handle type="target" position={Position.Top} />
                    <Handle type="source" position={Position.Right} />
                    <Handle type="source" position={Position.Bottom} />
                    <Handle type="source" position={Position.Left} />
                    <svg width="150" height="150" viewBox="0 0 100 100" style={{ display: 'block', overflow: 'visible', }}>
                        <path d="M0,50 L50,0 L100,50 L50,100 z" fill="#ffeedd" stroke-width="0" stroke="#fff"></path>
                    </svg>
                    <div className="label">
                        {data.icon && <div className="icon">{data.icon}</div>}
                        {data.label}
                    </div>
                </div> */}
            </div >
        </>
    )
})