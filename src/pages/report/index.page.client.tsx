import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Mustache from 'mustache'
import axios from 'axios'
import JoditEditor from 'jodit-react'
import template2 from '../../../templates/template2.mustache?raw'
import './report.scss'

export { Page }

function Loading() {
    return <div>Loading map...</div>
}

const mock = (content: string) => ({
    sapDesc: 'BAG-LL',
    plmNo: '5020964',
    plmSpecName: 'BAG-LL',
    sapCode: '12002024',
    category: 'PLASTIC BASED',
    date: '13-Sep-2019',
    subCategory: 'Bag',
    issue: '001',
    group: 'Tube Bottom Seal - Single Layer',
    instructionHtml: content,
    approveHistory: [
        {
            rowSpan: 1,
            status: 'Final Review',
            username: 'Unnapa Hunnakkarin', date: '08-Oct-2019', comments: 'OK', result: 'Approved',
        },
        {
            rowSpan: 2,
            status: 'Review',
            username: 'Yaovanat Puttanajan', date: '08-Oct-2019', comments: 'OK', result: 'Approved',
        },
        {
            rowSpan: 0,
            status: 'Review',
            username: 'Yaovanat Puttanajan', date: '08-Oct-2019', comments: 'OK', result: 'Approved',
        },
        {
            rowSpan: 3,
            status: 'Prepare for Review',
            username: 'Unnapa Hunnakkarin', date: '08-Oct-2019', comments: 'OK', result: 'Approved',
        },
        {
            rowSpan: 0,
            status: 'Prepare for Review',
            username: 'Unnapa Hunnakkarin', date: '08-Oct-2019', comments: 'OK', result: 'Approved',
        },
        {
            rowSpan: 0,
            status: 'Prepare for Review',
            username: 'Unnapa Hunnakkarin', date: '08-Oct-2019', comments: 'OK', result: 'Approved',
        },
        {
            rowSpan: 1,
            status: 'Change Request',
            username: 'Unnapa Hunnakkarin', date: '08-Oct-2019', comments: 'OK', result: 'Approved',
        },
        {
            rowSpan: 1,
            status: 'Final Review',
            username: 'Unnapa Hunnakkarin', date: '08-Oct-2019', comments: 'OK', result: 'Approved',
        },
    ]
})

function Page() {
    // const report = useRef<HTMLDivElement>(null)
    const editor = useRef(null)
    const [content, setContent] = useState('')
    const [renderedTemplate, setRenderedTemplate] = useState('')

    const editorConfig = useMemo(() => ({
        readonly: false,
        width: '100%',
        height: '20rem',
    }), [])

    useEffect(() => {
        const rendered = Mustache.render(template2, mock(content))
        setRenderedTemplate(rendered)
    }, [content])

    const save = useCallback(async () => {
        const resp = await axios.post<BlobPart>('/api/pdf', {
            template: 'template2',
            data: mock(content),
        }, { responseType: 'blob' })

        const downloadUrl = window.URL.createObjectURL(new Blob([resp.data]))
        const link = document.createElement('a')
        link.href = downloadUrl
        link.setAttribute('download', 'test.pdf')
        document.body.appendChild(link)
        link.click()
        link.remove()
    }, [renderedTemplate])

    return (
        <div className="flex">
            <div className="report-container">
                <React.Suspense fallback={<Loading />}>
                    <JoditEditor
                        ref={editor}
                        value={content}
                        config={editorConfig}
                        onBlur={(newContent: string) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                        onChange={(newContent: string) => { }}
                    />
                </React.Suspense>
                <iframe srcDoc={renderedTemplate} style={{ width: '100%', height: '100%' }}></iframe>
            </div>
            <div className="button" onClick={save}>PDF</div>
        </div>
    )
}
