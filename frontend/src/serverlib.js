import axios from 'axios';

export default async function aiCall(prompt) {
    console.log(`server lib call ai ${prompt}`)
    try {
        // attach prompt to the post body:
        const response = await axios.post('/ai', { ai: prompt });
        const { data } = response;
        return data.message;
    } catch (error) {
        console.error('Error calling AI:', error);
        throw error;
    }
}
