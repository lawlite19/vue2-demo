import fetch from '../config/fetch'

/**
 * DBIP在线查询接口
 */

export const dbipLocation = data => fetch('/dbiplocation/' + data)

/**
 * 
 */
export const ipInfoLocation = (ip, tokenDict) => fetch('/ipinfolocation/' + ip, tokenDict)

/**
 * ipgeolocation
 */

export const ipGeoLocation = data => fetch('/ipgeolocation', data)

/**
 * 登陆
 */

 export const login = data => fetch('/admin/login', data, 'POST')

 /**
	* 退出
	*/
 
 export const signout = () => fetch('/admin/signout')
