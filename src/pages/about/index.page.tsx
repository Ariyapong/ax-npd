import React, { useState } from 'react'
import { usePageContext } from '../../../renderer/usePageContext'

export { Page }

const filters = [
  {
    "filter": {
      "id": 0,
      "name": "Spec Name",
      "type": "text",
      "conditions": [
        {
          "index": 0,
          "name": "Contains"
        },
        {
          "index": 1,
          "name": "Ends With"
        }
      ]
    }
  },
  {
    "filter": {
      "id": 1,
      "name": "Spec Date",
      "type": "date",
      "conditions": [
        {
          "index": 0,
          "name": "Greater Than"
        },
        {
          "index": 1,
          "name": "Less Than"
        }
      ]
    }
  },
  {
    "filter": {
      "id": 2,
      "name": "Status",
      "type": "select",
      "conditions": [
        {
          "index": 0,
          "name": "Equals"
        }
      ],
      "lov": [
        {
          "index": 0,
          "name": "Active"
        }
      ]
    }
  }
]

function Page() {
  const pageContext = usePageContext()
  const [arrayValue, setArrayValue] = useState<Array<any>>([])

  return (
    <>
      <h1>{`APP_TEST ${pageContext.env.VITE_APP_TEST}`}</h1>
      <div className="flex flex-col">
        {filters.map((item, index) => {
          if (item.filter.type === 'text' || item.filter.type === 'date') {
            return <input key={index} type={item.filter.type} value={arrayValue[index]}
              onChange={(e) => setArrayValue(prev => {
                prev[index] = e.target.value
                return prev
              })} />
          }
        })}
      </div>
    </>
  )
}
