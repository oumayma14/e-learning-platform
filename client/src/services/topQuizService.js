// src/services/topQuizService.js
import axios from "axios";

export const fetchTopQuizzes = async () => {
    try {
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        let endpoint;
        let headers = {};

        if (userData && token) {
            const user = JSON.parse(userData);
            const userId = user._id || user.id || user.userId || user.username;

            if (userId) {
                endpoint = `http://localhost:3002/api/recommendations/${userId}`;
                headers.Authorization = `Bearer ${token}`;
            } else {
                endpoint = `http://localhost:3002/api/recommendations/popular`;
            }

        } else {
            endpoint = `http://localhost:3002/api/recommendations/popular`;
        }

        const response = await axios.get(endpoint, {
            headers: {
                ...headers,
                "Content-Type": "application/json",
            },
        });

        if (!response.data.success || !Array.isArray(response.data.data) || response.data.data.length === 0) {
            endpoint = `http://localhost:3002/api/recommendations/popular`;
            const popularResponse = await axios.get(endpoint);
            return popularResponse.data.data || [];
        }

        return response.data.data;

    } catch (err) {
        throw new Error(err.message || "Erreur de connexion");
    }
};
