'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const llmManager = uniCloud.ai.getLLMManager({
		provider: 'deepseek',
		apiKey: 'sk-8d4130ab5bbc479996bcd05a03fd99fb',

	})
	const res = await llmManager.chatCompletion({
		messages: [{
			role: 'user',
			content: '根据今天的日期和深圳的天气，生成一个每日指引，包括着装建议，谈事情的时间，感情、会客时间等等，偏玄学的每日运势。让我心理更有依据和信息去完成每日的工作生活。输出内容不要写“玄学”二字。'
		}]
	})
	console.log(res)

	//返回数据给客户端
	return res.reply
};