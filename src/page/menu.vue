<template>
	<div class="manage_page fillcontain">
		<el-row style="height: 100%;">
	  		<el-col :span="4"  style="min-height: 100%; background-color: #324057;">
				<el-menu :default-active="defaultActive" style="min-height: 100%;" theme="dark" router>
					<el-menu-item index="/"><i class="el-icon-menu"></i>首页</el-menu-item>
					<el-submenu index="2">
						<template slot="title"><i class="el-icon-document"></i>IP定位</template>
						<el-menu-item index="ipLocation">IP定位</el-menu-item>
					</el-submenu>
					<el-submenu index="3">
						<template slot="title"><i class="el-icon-plus"></i>PlaceHolder</template>
						<el-menu-item index="addShop">PlaceHolder</el-menu-item>
						<el-menu-item index="addGoods">PlaceHolder</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-col>
			<el-col :span="20" style="height: 100%;overflow: auto;">
				<keep-alive>
				    <router-view></router-view>
				</keep-alive>
			</el-col>
		</el-row>
  	</div>
</template>

<script>
export default {
computed: {
  defaultActive: function(){
    return this.$route.path.replace('/', '');
  }
},
}
</script>


<style lang="less" scoped>
	@import '../style/mixin.less';
	.manage_page{
		
	}
</style>
