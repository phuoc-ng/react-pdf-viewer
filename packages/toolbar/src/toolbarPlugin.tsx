/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import {
    Plugin,
    PluginFunctions,
    PluginOnDocumentLoad,
    RenderViewer,
    ViewerState,
    PluginOnTextLayerRender,
} from '@react-pdf-viewer/core';
import { fullScreenPlugin, FullScreenPlugin, FullScreenPluginProps } from '@react-pdf-viewer/full-screen';
import { getFilePlugin, GetFilePlugin, GetFilePluginProps } from '@react-pdf-viewer/get-file';
import { openPlugin, OpenPlugin } from '@react-pdf-viewer/open';
import { pageNavigationPlugin, PageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { printPlugin, PrintPlugin, PrintPluginProps } from '@react-pdf-viewer/print';
import { propertiesPlugin, PropertiesPlugin } from '@react-pdf-viewer/properties';
import { rotatePlugin, RotatePlugin } from '@react-pdf-viewer/rotate';
import { scrollModePlugin, ScrollModePlugin, ScrollModePluginProps } from '@react-pdf-viewer/scroll-mode';
import { searchPlugin, SearchPlugin, SearchPluginProps } from '@react-pdf-viewer/search';
import { selectionModePlugin, SelectionModePlugin, SelectionModePluginProps } from '@react-pdf-viewer/selection-mode';
import { themePlugin, ThemePlugin } from '@react-pdf-viewer/theme';
import { zoomPlugin, ZoomPlugin, ZoomPluginProps } from '@react-pdf-viewer/zoom';

import Toolbar, { ToolbarProps } from './Toolbar';

interface ToolbarPlugin extends Plugin {
    Toolbar: (props: ToolbarProps) => React.ReactElement;
    // Plugins instance
    fullScreenPluginInstance: FullScreenPlugin;
    getFilePluginInstance: GetFilePlugin;
    openPluginInstance: OpenPlugin;
    pageNavigationPluginInstance: PageNavigationPlugin;
    printPluginInstance: PrintPlugin;
    propertiesPluginInstance: PropertiesPlugin;
    rotatePluginInstance: RotatePlugin;
    scrollModePluginInstance: ScrollModePlugin;
    searchPluginInstance: SearchPlugin;
    selectionModePluginInstance: SelectionModePlugin;
    themePluginInstance: ThemePlugin;
    zoomPluginInstance: ZoomPlugin;
}

export interface ToolbarPluginProps {
    fullScreenPlugin?: FullScreenPluginProps;
    getFilePlugin?: GetFilePluginProps;
    printPlugin?: PrintPluginProps;
    scrollModePlugin?: ScrollModePluginProps;
    searchPlugin?: SearchPluginProps;
    selectionModePlugin?: SelectionModePluginProps;
    zoomPlugin?: ZoomPluginProps;
}

const toolbarPlugin = (props?: ToolbarPluginProps): ToolbarPlugin => {
    const fullScreenPluginInstance = fullScreenPlugin(props ? props.fullScreenPlugin : {});
    const getFilePluginInstance = getFilePlugin(props ? props.getFilePlugin : {});
    const openPluginInstance = openPlugin();
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const printPluginInstance = printPlugin(props ? props.printPlugin : {});
    const propertiesPluginInstance = propertiesPlugin();
    const rotatePluginInstance = rotatePlugin();
    const scrollModePluginInstance = scrollModePlugin(props ? props.scrollModePlugin : {});
    const searchPluginInstance = searchPlugin(props ? props.searchPlugin : {});
    const selectionModePluginInstance = selectionModePlugin(props ? props.selectionModePlugin : {});
    const themePluginInstance = themePlugin();
    const zoomPluginInstance = zoomPlugin(props ? props.zoomPlugin : {});

    const plugins = [
        fullScreenPluginInstance,
        getFilePluginInstance,
        openPluginInstance,
        pageNavigationPluginInstance,
        printPluginInstance,
        propertiesPluginInstance,
        rotatePluginInstance,
        scrollModePluginInstance,
        searchPluginInstance,
        selectionModePluginInstance,
        themePluginInstance,
        zoomPluginInstance,
    ];

    const ToolbarDecorator = (props: ToolbarProps) => {
        const { EnterFullScreen, EnterFullScreenMenuItem } = fullScreenPluginInstance;
        const { Download, DownloadMenuItem } = getFilePluginInstance;
        const { Open, OpenMenuItem } = openPluginInstance;
        const {
            CurrentPageInput,
            CurrentPageLabel,
            GoToFirstPage,
            GoToFirstPageMenuItem,
            GoToLastPage,
            GoToLastPageMenuItem,
            GoToNextPage,
            GoToNextPageMenuItem,
            GoToPreviousPage,
            GoToPreviousPageMenuItem,
        } = pageNavigationPluginInstance;
        const { Print, PrintMenuItem } = printPluginInstance;
        const { ShowProperties, ShowPropertiesMenuItem } = propertiesPluginInstance;
        const { Rotate, RotateBackwardMenuItem, RotateForwardMenuItem } = rotatePluginInstance;
        const { SwitchScrollMode, SwitchScrollModeMenuItem } = scrollModePluginInstance;
        const { Search, ShowSearchPopover } = searchPluginInstance;
        const { SwitchSelectionMode, SwitchSelectionModeMenuItem } = selectionModePluginInstance;
        const { SwitchTheme, SwitchThemeMenuItem } = themePluginInstance;
        const { CurrentScale, Zoom, ZoomIn, ZoomInMenuItem, ZoomOut, ZoomOutMenuItem } = zoomPluginInstance;

        const NumberOfPages = () => <CurrentPageLabel>{(props) => <>{props.numberOfPages}</>}</CurrentPageLabel>;

        return (
            <Toolbar
                {...props}
                slot={{
                    CurrentPageInput,
                    CurrentPageLabel,
                    CurrentScale,
                    Download,
                    DownloadMenuItem,
                    EnterFullScreen,
                    EnterFullScreenMenuItem,
                    GoToFirstPage,
                    GoToFirstPageMenuItem,
                    GoToLastPage,
                    GoToLastPageMenuItem,
                    GoToNextPage,
                    GoToNextPageMenuItem,
                    GoToPreviousPage,
                    GoToPreviousPageMenuItem,
                    NumberOfPages,
                    Open,
                    OpenMenuItem,
                    Print,
                    PrintMenuItem,
                    Rotate,
                    RotateBackwardMenuItem,
                    RotateForwardMenuItem,
                    Search,
                    ShowProperties,
                    ShowPropertiesMenuItem,
                    ShowSearchPopover,
                    SwitchScrollMode,
                    SwitchScrollModeMenuItem,
                    SwitchSelectionMode,
                    SwitchSelectionModeMenuItem,
                    SwitchTheme,
                    SwitchThemeMenuItem,
                    Zoom,
                    ZoomIn,
                    ZoomInMenuItem,
                    ZoomOut,
                    ZoomOutMenuItem,
                }}
            />
        );
    };

    return {
        // Plugin instances
        fullScreenPluginInstance,
        getFilePluginInstance,
        openPluginInstance,
        pageNavigationPluginInstance,
        printPluginInstance,
        propertiesPluginInstance,
        rotatePluginInstance,
        scrollModePluginInstance,
        searchPluginInstance,
        selectionModePluginInstance,
        themePluginInstance,
        zoomPluginInstance,
        install: (pluginFunctions: PluginFunctions) => {
            // Install plugins
            plugins.forEach((plugin) => {
                if (plugin.install) {
                    plugin.install(pluginFunctions);
                }
            });
        },
        renderViewer: (props: RenderViewer) => {
            let { slot } = props;
            plugins.forEach((plugin) => {
                if (plugin.renderViewer) {
                    slot = plugin.renderViewer({ ...props, slot });
                }
            });
            return slot;
        },
        uninstall: (pluginFunctions: PluginFunctions) => {
            // Unistall plugins
            plugins.forEach((plugin) => {
                if (plugin.uninstall) {
                    plugin.uninstall(pluginFunctions);
                }
            });
        },
        onDocumentLoad: (props: PluginOnDocumentLoad) => {
            plugins.forEach((plugin) => {
                if (plugin.onDocumentLoad) {
                    plugin.onDocumentLoad(props);
                }
            });
        },
        onTextLayerRender: (props: PluginOnTextLayerRender) => {
            plugins.forEach((plugin) => {
                if (plugin.onTextLayerRender) {
                    plugin.onTextLayerRender(props);
                }
            });
        },
        onViewerStateChange: (viewerState: ViewerState) => {
            let newState = viewerState;
            plugins.forEach((plugin) => {
                if (plugin.onViewerStateChange) {
                    newState = plugin.onViewerStateChange(newState);
                }
            });
            return newState;
        },
        Toolbar: ToolbarDecorator,
    };
};

export default toolbarPlugin;
