/*
 * @Description: 
 * @Autor: caihq
 * @Date: 2025-03-09 15:09:17
 * @LastEditTime: 2025-03-09 15:11:19
 * @FilePath: /uni-ai-chat/services/deepseek.js
 */
import apiConfig from '../config/api.js'

class DeepseekService {
    constructor() {
        this.config = apiConfig.deepseek
    }

    async chat(messages) {
        try {
            const response = await uni.request({
                url: `${this.config.baseURL}/chat/completions`,
                method: 'POST',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`
                },
                data: {
                    model: this.config.model,
                    messages: messages,
                    temperature: this.config.temperature,
                    max_tokens: this.config.max_tokens,
                    stream: true
                }
            })

            return response.data
        } catch (error) {
            console.error('DeepSeek API Error:', error)
            throw error
        }
    }
}

export default new DeepseekService()