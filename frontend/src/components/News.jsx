import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Paper, Typography, Box, List, ListItem, ListItemText, Link } from '@mui/material';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_KEY = "a5c4d5c859c94fa291df55b748ec02f7"


    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await axios.get(
                    `https://newsapi.org/v2/everything?q=italia&sortBy=publishedAt&apiKey=${API_KEY}`
                );
                setNews(res.data.articles);
            } catch (err) {
                setError('Impossibile caricare le news');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) return <Typography>Caricamento news...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                News Italia
            </Typography>
            <List>
                {news.slice(0, 3).map((article, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={
                                <Link href={article.url} target="_blank" rel="noopener noreferrer">
                                    {article.title}
                                </Link>
                            }
                            secondary={article.source.name}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default News;