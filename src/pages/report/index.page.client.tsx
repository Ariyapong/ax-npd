import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Mustache from 'mustache'
import axios from 'axios'
import JoditEditor, { Jodit } from 'jodit-react'
import { asBlob } from 'html-docx-js-typescript'
import { saveAs } from 'file-saver'
import template2 from '../../../public/templates/template2.mustache?raw'
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
        extraButtons: ['insertImage'],
        uploader: {
            insertImageAsBase64URI: false
        },
    }), [])

    useEffect(() => {
        uploadImageButton()
    }, [])

    useEffect(() => {
        const rendered = Mustache.render(template2, mock(content))
        setRenderedTemplate(rendered)
    }, [content])

    const saveAsPdf = useCallback(async () => {
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

    const saveAsWord = useCallback(async () => {
        const fileBuffer = await asBlob(renderedTemplate)
        saveAs(fileBuffer as Blob, 'test.docx')
    }, [renderedTemplate])

    const uploadImageButton = () => {
        Jodit.defaultOptions.controls.insertImage = {
            name: 'Insert Image',
            tooltip: 'Insert Image',
            icon: 'image',
            // iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Instagram-Icon.png/1200px-Instagram-Icon.png',
            exec: (async (editor) => {
                console.log('#####')
                imageUpload(editor)
            })
        }
    }

    const imageUpload = (editor: any) => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()

        input.onchange = async function () {
            if (input.files && input.files.length > 0) {
                const imageFile = input.files[0]
                if (!imageFile) {
                    return
                }
                if (!imageFile.name.match(/\.(jpg|jpeg|png)$/)) {
                    return
                }
                const base64 = await fileToBase64(imageFile)
                insertImage(editor, base64)
            }
        }
    }

    const fileToBase64 = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(String(reader.result))
            reader.onerror = reject
        })
    }

    const insertImage = (editor: any, url: string) => {
        const image = editor.selection.j.createInside.element('img')
        image.setAttribute('src', url)
        editor.selection.insertNode(image)
    }

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
            <div className="flex flex-col">
                <div className="button" onClick={saveAsPdf}>PDF</div>
                <div className="button" onClick={saveAsWord}>MS Word</div>
            </div>
        </div>
    )
}
