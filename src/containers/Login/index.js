import React, { Component } from 'react';
import {connect} from "react-redux";
import {browserHistory, Link} from "react-router";
import style from './index.css';
import {List, Icon, Button, InputItem, Toast, WingBlank, ActivityIndicator} from 'antd-mobile';
import { createForm } from 'rc-form';
import mima from "svg/mima.svg";
import shouji from "svg/shouji.svg";
import logo from "svg/logo.svg";
import {userInfo} from "reduxs/userInfo";

class LoginForm extends Component {
	state={
		loading:false,
	}
	componentDidMount(){
		localStorage.removeItem("reduxPersist:userInfo")
	}
	handleSubmit = ()=>{
		this.props.form.validateFields((err, values)=>{
			if(err){
				for(var name in err){
					Toast.info(err[name].errors[0].message);
					break;
				}
			}else{
				this.setState({
					loading:true
				})
				window.HOCFetch({ needToken:false })(global.url.login + "?mobile=" + values.mobile.replace(/\s+/g, '') + "&password=" + values.password)
				.then((response)=>response.json())
				.then((data)=>{
					console.log(data);
					this.setState({
						loading:false
					})
					Toast.info(data.msg.message,1.5);
					if(data.msg.status === "success"){
						window.HOCFetch({ needToken:false })(global.url.current_user + "?token=" + encodeURIComponent(data.user.token) )
						.then((response)=>response.json())
						.then((data)=>{
							this.props.userInfoAction(data.user);
							browserHistory.push("/WXLogin");
						})
					}
				})
			}
		})
	}
	render() {
		const { getFieldProps } = this.props.form;
		return (
			<div>
				<List>
					<InputItem
						{...getFieldProps('mobile',{
							rules: [
								{ required: true, message: '请输入手机号' },
								{ len:13 ,  message: '手机号位数错误'}
							]
						})}
						placeholder="请输入您的手机号"
						type="phone"
						labelNumber={2}
						clear={true}
					>
						<Icon type={shouji} className={style.formIcon}/>
					</InputItem>
					<InputItem
						{...getFieldProps('password',{
							rules: [
								{ required: true, message: '请输入密码' }
							]
						})}
						type="password"
						placeholder="登录密码"
						labelNumber={2}
						clear={true}
					>
						<Icon type={mima} className={style.formIcon}/>
					</InputItem>
				</List>
				<Button className={style.btn} type="primary" onClick={this.handleSubmit}>登录</Button>
				<ActivityIndicator toast  animating={this.state.loading}/>
			</div>
		);
	}
}

const LoginFormWrap = connect (
	(state)=>{
		return {}
	},
	(dispatch)=>{
		return {
			userInfoAction:(data)=>{
				dispatch(userInfo(data))
			}
		}
	}
)(createForm()(LoginForm));

class Login extends Component {
	render() {
		return (
			<div className={style.login}>
				<WingBlank size="md">
					<Icon type={logo} className={style.logo}  />
					<LoginFormWrap/>
					<div className={style.link}>
						<Link to="/Register">注册新账号</Link>
						<Link to="/FindPassWord">忘记密码</Link>
					</div>
				</WingBlank>
			</div>
		);
	}
}
export default Login;

