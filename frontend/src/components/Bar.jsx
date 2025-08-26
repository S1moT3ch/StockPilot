//import dei componenti necessari
import {AppBar, Box, Toolbar} from "@mui/material";
import Menu from "./Menu";
import React from "react";

const Bar = () => {
    //barra superiore colorata
    return (
        <AppBar position="static" sx={{ backgroundColor: "#abeece" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between"}}>
                <Box sx={{ display: "flex", alignItems: "center"}}>
                    <img src="/StockPilot_icon_full_no_bg.png" alt="Logo StockPilot" style={{ height: 50 }} />
                </Box>
                {/* Inserimento del menù laterale a sinistra nella barra */}
                <Box sx={{ display: "flex", alignItems: "center"}}>
                    <Menu/>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Bar;