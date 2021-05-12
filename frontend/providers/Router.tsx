import React from 'react'

type Pages = 'welcome'|'settings'

const RouterContext = React.createContext({
  page: '',
  navigate: (p: Pages) => { }
})
export default RouterContext

export function RouterProvider(p:any) {

  const [page, setPage] = React.useState<Pages>('welcome')

  return (
    <RouterContext.Provider value={{page: page, navigate: setPage}}>
      {p.children}
    </RouterContext.Provider>
  )
}