<template>
  <div class="fillcontain">
    <head-top></head-top>
		<div>
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="查询IP">
					<el-input type="textarea" v-model="form.desc"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="searchIp">单IP查询</el-button>
					<el-button type="primary" @click="batchSearchIps">批量查询</el-button>
					<el-button type="primary" @click="exportExcel()">下载表格数据</el-button>
					<el-button type="primary" @click="resetForm">清空</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="table_container" v-for="(tableData, index) in tables" :key="index">
			<!-- <p> {{index}}  => {{tableData}}}</p> -->
			<el-table
			v-loading="loading"
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

		<!-- IP比较详情 -->
		<div class="table_container">
			<!-- <p> {{index}}  => {{tableData}}}</p> -->
			<el-table
			id="out-table" 
			:data="batchCompareTableData"
			border
			style="width: 100%">
			<!-- :render-header="renderHeader" -->
			<el-table-column
				v-for="(item, index1) in dynamicCompareColumns"
				
				:key="'key00' + index1"
				:prop="item"
				:label="item"
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
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'
  export default {
    data() {
      return {
				form: {
          desc: '1.1.1.1'
        },
				// 每个厂商的结果是一张表
        tables: [],
				// 每个厂商的字段列表
				dynamicColumns: [],
				// IP库信息
				fixedColumns: [],
				// 索引信息
				indexs: [],
				loading: true,
				batchCompareTableData: [],
				dynamicCompareColumns: []
      }
    },
    components: {
      headTop
    },
		mounted(){
			// this.initData();
		},
		computed: {
		},
		methods: {
    		async searchIp(){
					this.clearData()
					let count = 1
					let ip = this.form.desc
					// dbip在线请求
					// ipdbInfos.push({'prop': 'IP库', ''})
    			try{
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
						// let data = {'token': '自己申请的token'}
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
						// let data = {'apiKey': '自己注册的秘钥', 'ip': ip}
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
					this.loading=false
    		},
				batchSearchIps () {
					this.batchCompareTableData = [
						{
							"ip": "1.1.1.1",
							"dbip": "CN\n江苏省",
							"ipgeolocation": "SG",
							"ipinfo": "ipinfo"
						},
						{
							"ip": "1.1.1.2",
							"dbip": "CN",
							"ipgeolocation": "SG",
							"ipinfo": "ipinfo"
						}
					]
					if (this.batchCompareTableData.length > 0) {
						this.dynamicCompareColumns = Object.keys(this.batchCompareTableData[0])
					} else {
						this.batchCompareTableData = {
							"message": "查询失败",
						}
						this.dynamicCompareColumns = ['message']
					}
				},
				renderHeader() {
          return (
              <div>
                 <el-button type='primary' size='small' on-click={()=>this.exportExcel()}>导出表格</el-button>
              </div>
          )
     		},
				  // 导出功能
        exportExcel() {
          /* generate workbook object from table */
          var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
          /* get binary string as output */
          var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
          try {
              FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'ip_result_' + this.getCurrentTime() + '.xlsx')
          } catch (e) { 
						if (typeof console !== 'undefined') console.log(e, wbout) 
					}
          return wbout
         },
				getCurrentTime() {
        //获取当前时间并打印
        	var _this = this;
					let yy = new Date().getFullYear();
					let mm = new Date().getMonth()+1;
					let dd = new Date().getDate();
					let hh = new Date().getHours();
					let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
					let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
					let time = yy+'-'+mm+'-'+dd+'_'+hh+'_'+mf+'_'+ss;
					return time
				},
				resetForm() {
					this.form.desc = '1.1.1.1'
					// 每个厂商的结果是一张表
					this.tables = []
					// 每个厂商的字段列表
					this.dynamicColumns = []
					// IP库信息
					this.fixedColumns = []
					// 索引信息
					this.indexs = []
				},
				clearData() {
					// 每个厂商的结果是一张表
					this.tables = []
					// 每个厂商的字段列表
					this.dynamicColumns = []
					// IP库信息
					this.fixedColumns = []
					// 索引信息
					this.indexs = [],
					this.loading = true
				},
    	}
  }
</script>

<style lang="less" scoped>
.fillcontain {
	/deep/ .el-table {
		 .cell {
			white-space: pre-line;
		}
	}
}
</style>
