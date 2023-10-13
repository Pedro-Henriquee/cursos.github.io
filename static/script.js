window.onload = () => {
    const RESULT_DIV = "div#result"

    const performCleanUp = () => {
        let children = document.querySelector(RESULT_DIV)
        while (children.firstChild) {
            children.removeChild(children.firstChild)
        }
    }

    const dataSanitizer = (text) => {
        return (
            text
            .toLowerCase()
            .replaceAll(" ", "")
            .replaceAll(",", "")
        )
    }

    const searchItem = (searchBoxVal) => {
        const data = JSON.parse(sessionStorage.getItem('data'))
        let foundItems = []
        Object.values(data).forEach((item) => {
            let row = dataSanitizer(Object.values(item).join())
            let lkupTerm = dataSanitizer(searchBoxVal)
            if(row.search(lkupTerm) >= 0){
                foundItems.push(item)
            }
        })
        if(foundItems.length === 0){
            return data
        }
        return foundItems
    }

    const gatherDataBasedOnSubject = (subject, data) => {
        let table = document.createElement('table')
        let tr = document.createElement('tr')

        if(data.length === 0) {
            return null
        }
        Object.keys(data[0]).forEach((item, _) => {
            let headerItem = document.createElement('th')
            headerItem.textContent = item.toUpperCase()
            tr.appendChild(headerItem)
        })

        table.appendChild(tr)

        switch(subject) {
            case "devs":
                data.forEach((item) => {
                    let tr = document.createElement('tr')
                    Object.values(item).forEach((value, _) => {
                        let td = document.createElement('td')
                        td.textContent = value
                        tr.appendChild(td)
                    })
                    table.appendChild(tr)
                })
                return table
            default:
                return null
        }
    }

    const message404 = () => {
        let h2 = document.createElement('h2')
        h2.id = "not-found"
        h2.textContent = "Oops, parece que não temos esse dado ainda!"
        return h2
    }

    const renderNotFound = () => {
        let iFrame = document.createElement('iframe')
        iFrame.src = "https://giphy.com/embed/l2JhORT5IFnj6ioko"
        iFrame.id = "not-found"
        iFrame.width = "80%"
        iFrame.className = "giphy-embed"
        return iFrame
    }

    const listRequestedData = (choice) => {
        performCleanUp()
        fetch(`./data/${choice}.json`)
            .then(res => res.json())
            .then(data => {
                fullListOfData(choice, data)
                sessionStorage.setItem('data', JSON.stringify(data))
                document.querySelector('input#search').style.display = "block"
            })
            .catch(() => {
                [renderNotFound, message404].forEach((renderError) => {
                    document.querySelector(RESULT_DIV).appendChild(renderError())
                })
                document.querySelector('input#search').style.display = "none"
            })
    }

    const fullListOfData = (choice, data) => {
        performCleanUp()
        const tableOfContents = gatherDataBasedOnSubject(choice, data)
        if (tableOfContents !== null) {
            document.querySelector(RESULT_DIV).appendChild(tableOfContents)
        }
    }

    document.querySelector('select#first-step').addEventListener('change', (e) => {
        listRequestedData(e.target.value)
    })
    document.querySelector('input#search').addEventListener('keyup', (e) => {
        let lkupValue = e.target.value
        let data = searchItem(lkupValue)
        fullListOfData("devs", data)
    })
}