// import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import * as toolkitRaw from '@reduxjs/toolkit'
const { createSlice } = ((toolkitRaw as any).default ?? toolkitRaw) as typeof toolkitRaw

type ReportData = {
  imgUrl: string
  html: string
  header: {}
  body: string
}

type Reports = {
  activePage: number;
  details: Array<ReportData>
}

const initialState: Reports = {
  activePage: 0,
  details: [{ header: {}, body: '', imgUrl: '', html: '' }]
}

export const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setReportData: (state, action: toolkitRaw.PayloadAction<{ data: ReportData }>) => {
      const { data } = action.payload
      const activePage = state.activePage
      const found = state.details[activePage]
      if (found) {
        state.details.splice(activePage, 1, data)
      } else {
        state.details.push(data)
      }
    },
    addNewPage: (state) => {
      const lastLenght = state.details.length
      state.activePage = lastLenght
      state.details.push({ header: {}, body: '', imgUrl: '', html: '' })
    },
    deletePage: (state, action: toolkitRaw.PayloadAction<number>) => {
      const index = action.payload
      state.details.splice(index, 1)
    },
    setActivePage: (state, action: toolkitRaw.PayloadAction<number>) => {
      state.activePage = action.payload
    }
  },
})

export const { setReportData, addNewPage, deletePage, setActivePage } = reportSlice.actions

export default reportSlice.reducer
