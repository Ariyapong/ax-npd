import React, { useRef, useState } from 'react'
import PivotTableUI, { PivotTableUIProps } from 'react-pivottable/PivotTableUI'
import TableRenderers from 'react-pivottable/TableRenderers'
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers'
import Plot from 'react-plotly.js'
import { tips } from './tips'
import { useDebounce } from '../../utils'
import 'react-pivottable/pivottable.css'
import './pivot.scss'

export { Page }

type PlotlyPivotTableProps = PivotTableUIProps
    & { plotlyOptions: Partial<Plotly.Layout> }
    & { plotlyConfig: Partial<Plotly.Config> }

const initialPivotState: Partial<PlotlyPivotTableProps> = {
    data: tips,
    rendererName: 'Grouped Column Chart',
    plotlyOptions: { width: 500, height: 500 },
    plotlyConfig: {},
}

class PivotTableUISmartWrapper extends React.PureComponent<Partial<PivotTableUIProps>, Partial<PivotTableUIProps>> {
    constructor(props: Readonly<Partial<PivotTableUIProps>>) {
        super(props)
        this.state = props
    }

    componentWillReceiveProps(nextProps: Partial<PivotTableUIProps>) {
        this.setState(nextProps)
    }

    shouldComponentUpdate(nextProps: Readonly<Partial<PivotTableUIProps>>, nextState: Readonly<Partial<PivotTableUIProps>>, nextContext: any): boolean {
        this.state.rows?.forEach((pRow) => {
            nextState.cols?.forEach((nCol) => {
                if (pRow === nCol && !this.state.cols?.includes(nCol)) {
                    const index = nextState.rows?.findIndex(r => r === pRow)
                    if (index !== undefined && index > -1) {
                        nextState.rows?.splice(index, 1)
                        return
                    }
                }
            })
        })
        this.state.cols?.forEach((pCol) => {
            nextState.rows?.forEach((nRow) => {
                if (pCol === nRow && !this.state.rows?.includes(nRow)) {
                    const index = nextState.cols?.findIndex(c => c === pCol)
                    if (index !== undefined && index > -1) {
                        nextState.cols?.splice(index, 1)
                        return
                    }
                }
            })
        })
        return true
    }

    render() {
        const data = this.state.data ?? []
        return (
            <PivotTableUI
                renderers={Object.assign(
                    {},
                    TableRenderers,
                    createPlotlyRenderers(Plot)
                )}
                data={data}
                {...this.state}
                onChange={s => this.setState(s)}
                unusedOrientationCutoff={Infinity}
            />
        )
    }
}

function Page() {
    const [pivotState, setPivotState] = useState<Partial<PivotTableUIProps>>(initialPivotState)

    return (
        <PivotTableUISmartWrapper {...pivotState} />
    )
}
