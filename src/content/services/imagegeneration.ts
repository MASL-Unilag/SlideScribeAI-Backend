import axios, { AxiosResponse } from 'axios';
import { config } from '../../core';
import { HttpStatus } from "../../core";
import { AppMessages } from "../../common";

 interface ImageResponse {
    data: {
        data: { url: string }[];
    };
}


interface ImageResult {
    code?: number;
    imageUrl?: string;
    successMessage ?: string;
    errorMessage?: string;
}


async function generateImage(prompt: string): Promise<ImageResponse | string> {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/images/generations',
            {
                prompt: prompt,
                n: 1,
                size: "1024x1024"
            },
            {
                headers: {
                    'Authorization': `Bearer ${config.services.openaikey.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error generating image:', error);
        return "Error Generating Image! Try Again";
    }
}

export async function imageResult(): Promise<ImageResult> {
    try {
        const data = await generateImage("An image of The central processing unit (CPU) of a computer is comprised with digital circuits called arithmetic logic units (ALU) that are capable of performing billions of arithmetic and logic operations every second.");
  
        if (typeof data !== 'string') {
            if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
                const imageurl = data.data[0].url;  
               return {
                code: HttpStatus.OK,
                successMessage: AppMessages.SUCCESS.IMAGE_GENERATED, 
                imageUrl: imageurl
                }

            } else {
                return { errorMessage: AppMessages.FAILURE.IMAGE_TYPE_ERROR};
            }
        } else {
            return { errorMessage: data };
        }
    } catch (error) {
        return { errorMessage: AppMessages.FAILURE.IMAGE_GEN_ERROR };
    }
}



