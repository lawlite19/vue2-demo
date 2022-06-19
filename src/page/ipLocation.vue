<template>
  <div class="fillcontain">
    <head-top></head-top>
		<div class="table_container" v-for="(tableData, index) in tables" :key="index">
			<!-- <p> {{index}}  => {{tableData}}}</p> -->
			<el-table
			:data="tableData"
			:key="index"
			border
			style="width: 100%">
			<!-- index -->
			<el-table-column
				v-for="(item0, index0) in indexs[index]"
				:key="'key0' + index0"
				fixed
				:prop="item0.prop"
				:label="item0.label"
				width="50"
				>
			</el-table-column>
			<!-- ip库信息 -->
			<el-table-column
				v-for="(item1, index1) in fixedColumns[index]"
				:key="'key1' + index1"
				fixed
				:prop="item1.prop"
				:label="item1.label"
				width="180"
				>
				<template slot-scope="scope">
					<el-tag type="success">
						<a class="el-link el-link--primary is-underline" :href="scope.row.url" target="_blank">
							{{ scope.row.ipdb }}
						</a>
					</el-tag>
				</template>
			</el-table-column>

			<el-table-column
				v-for="(item, index2) in dynamicColumns[index]"
				:key="'key2' + index2"
				:v-else="item.prop!='ipdb'"
				:prop="item.prop"
				:label="item.label"
				width="180"
				>
			</el-table-column>
		</el-table>
		</div>
  </div>

</template>

<script>
  import headTop from '../components/headTop'
	import {dbipLocation, ipInfoLocation, ipGeoLocation} from '../api/getData'
  export default {
    data() {
      return {
				// 每个厂商的结果是一张表
        tables: [],
				// 每个厂商的字段列表
				dynamicColumns: [],
				// IP库信息
				fixedColumns: [],
				// 索引信息
				indexs: []
      }
    },
    components: {
      headTop
    },
		mounted(){
			this.initData();
		},
		computed: {
		},
		methods: {
    		async initData(){
					let count = 1
					// dbip在线请求
					// ipdbInfos.push({'prop': 'IP库', ''})
    			try{
						let ip = '8.8.8.8'
    				const res = await dbipLocation(ip);
    				if (res) {
							console.log('dbip result: ' + JSON.stringify(res))
							this.tables.push([res])
							res['ipdb'] = 'DBIP在线'
							res['url'] = 'https://db-ip.com/'
							res['rows'] = count++
							let colInfo = []
							Object.keys(res).forEach(key => {
								colInfo.push({prop: key, label: key})
							})
							this.dynamicColumns.push(colInfo)
							this.fixedColumns.push([{prop: 'ipdb', label: 'IP库'}])
							this.indexs.push([{prop: 'rows', label: ''}])
							// console.log('this.dynamicColumns: ' + JSON.stringify(this.dynamicColumns))
    				} else {
    					throw new Error(res)
    				}
    			}catch(err){
    				console.log('DBIP定位失败',err);
    			}

					// ipinfo在线请求
					try{
						let ip = '8.8.8.8'
						let data = {'token': '0d1137ca43a776'}
    				const res = await ipInfoLocation(ip, data);
    				if (res) {
							this.tables.push([res])
							console.log('ipInfo result: ' + JSON.stringify(res))
							let colInfo = []
							res['ipdb'] = 'IpInfo在线'
							res['url'] = 'https://ipinfo.io/'
							res['rows'] = count++
							Object.keys(res).forEach(key => {
								colInfo.push({prop: key, label: key})
							})
							this.dynamicColumns.push(colInfo)
							this.fixedColumns.push([{prop: 'ipdb', label: 'IP库'}])
							this.indexs.push([{prop: 'rows', label: ''}])
							// console.log('this.dynamicColumns: ' + JSON.stringify(this.dynamicColumns))
    				} else {
    					throw new Error(res)
    				}
    			}catch(err){
    				console.log('IpInfo定位失败',err);
    			}

					// ipgeolocation在线请求
					try{
						let ip = '8.8.8.8'
						let data = {'apiKey': '445d277b524f42318f2a784ed80a7515', 'ip': ip}
    				const res = await ipGeoLocation(data);
						res['ipdb'] = 'IpGeoLocation在线'
						res['url'] = 'https://ipgeolocation.io/'
						res['rows'] = count++
    				if (res) {
							this.tables.push([res])
							console.log('ipGeoLocation result: ' + JSON.stringify(res))
							let colInfo = []
							Object.keys(res).forEach(key => {
								colInfo.push({prop: key, label: key})
							})
							this.dynamicColumns.push(colInfo)
							this.fixedColumns.push([{prop: 'ipdb', label: 'IP库'}])
							this.indexs.push([{prop: 'rows', label: ''}])
							// console.log('this.dynamicColumns: ' + JSON.stringify(this.dynamicColumns))
    				} else {
    					throw new Error(res)
    				}
    			}catch(err){
    				console.log('IpGeoLocation定位失败',err);
    			}
    		}
    	}
  }
</script>
