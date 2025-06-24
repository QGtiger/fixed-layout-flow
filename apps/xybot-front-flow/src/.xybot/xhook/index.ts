import xhook from 'xhook'

const HTTP_CODES = window.YD?.HTTP_CODES || []

const report = (level: 'error' | 'info', req, data) => {
  const duration = Date.now() - req.headers['startTime']
  if (window.YD.ENABLE_REPORT) {
    const reportUrl = window.YD.REPORT_URL ? `${window.YD.REPORT_URL}/report-api` : '/report-api'
    fetch(reportUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'no-report': 'true'
      },
      body: JSON.stringify({
        level,
        span: 'http',
        uuid: localStorage.getItem('uuid') || '',
        user: localStorage.getItem('user') || '',
        userName: localStorage.getItem('userName') || '',
        enterpriseName: localStorage.getItem('enterpriseName') || '',
        href: window.location.href,
        origin: window.location.origin,
        duration,
        req: JSON.stringify({
          url: req.url,
          method: req.method || 'GET',
          headers: req.headers,
          body: req.body
        }),
        res: JSON.stringify(data),
        httpUrl: req.url,
        httpMethod: req.method || 'GET',
        httpCode: data.code,
        httpMsg: data.msg
      })
    })
  }
}

const toFetch = (req, res, cb) => {
  if (req?.headers?.['no-report'] === 'true') {
    cb(res)
  } else {
    if (res.headers.get('content-type')?.includes('application/json')) {
      res.json().then((data) => {
        console.log('fetch', data)
        if ((!data.success || data.code !== 200) && !HTTP_CODES.includes(data.code)) {
          report('error', req, data)
        }
        cb(new Response(JSON.stringify(data)))
      })
    } else {
      cb(res)
    }
  }
}

const toAjax = (req, res, cb) => {
  if (req?.headers?.['no-report'] === 'true') {
    cb(res)
  } else {
    if (res.headers['content-type']?.includes('application/json')) {
      const data = JSON.parse(res.data)

      if ((!data.success || data.code !== 200) && !HTTP_CODES.includes(data.code)) {
        report('error', req, data)
      }
      cb(data)
    } else {
      cb(res)
    }
  }
}

if (window.YD?.ENABLE_REPORT_HTTP) {
  xhook.before((req, cb) => {
    cb()
  })

  xhook.after((req, res, cb) => {
    const { isFetch } = req
    if (isFetch) {
      toFetch(req, res, cb)
    } else {
      toAjax(req, res, cb)
    }
  })
}
