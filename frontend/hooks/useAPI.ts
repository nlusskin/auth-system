/**
 * Small API wrapper to handle calls to authentication service
 */

import React from 'react';

const PORT = 3033;

declare type actions = 'authenticate'|'welcome';

const API_URL = `http://localhost:${PORT}/`;

function _useAPI<T>(endpoint: actions) {

  const [res, setRes] = React.useState<T | {error?: boolean}>();

  const _call = React.useCallback(async (data?:any, iter=0) => {
    let postdata = {
      method: data ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }
    if (data) {
      // @ts-ignore
      postdata['body'] = JSON.stringify(data)
    }

    try {
      let res = await fetch(API_URL + endpoint, postdata as RequestInit)
      
      let json = {} as any
      try { json = await res.json() }
      catch (e) { console.error('JSON input invalid') }
      
      if (!res.ok) {
        console.error('FETCH ERR', res)
        setRes({error: true})
        return
      }
      
      setRes(json)
    }
    catch(e) {
      console.error('FETCH ERR', e)
      setRes({ error: e })
    }
  }, [])

  return {data: res, call: _call }
}

function useAPI<T>(endpoint: actions) : { data: T & {error?: boolean}, call: (data?:any) => any }
function useAPI<T>(endpoint: actions) { return _useAPI<T>(endpoint) }

export { useAPI }