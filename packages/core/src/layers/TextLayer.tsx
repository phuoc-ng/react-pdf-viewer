/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import LayerRenderStatus from '../types/LayerRenderStatus';
import { Plugin } from '../types/Plugin';
import PdfJs from '../vendors/PdfJs';
import WithScale from './WithScale';

interface TextLayerProps {
    page: PdfJs.Page;
    pageIndex: number;
    plugins: Plugin[];
    rotation: number;
    scale: number;
}

const TextLayer: React.FC<TextLayerProps> = ({ page, pageIndex, plugins, rotation, scale }) => {
    const containerRef = React.useRef<HTMLDivElement>();
    const renderTask = React.useRef<PdfJs.PageRenderTask>();

    const empty = (): void => {
        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }

        const spans: HTMLElement[] = [].slice.call(containerEle.querySelectorAll('span.rpv-core__text-layer-text'));
        spans.forEach((span) => containerEle.removeChild(span));

        // Remove more elements generated by pdf.js
        const breaks: HTMLElement[] = [].slice.call(containerEle.querySelectorAll('br[role="presentation"]'));
        breaks.forEach((br) => containerEle.removeChild(br));
    };

    const renderText = (): void => {
        const task = renderTask.current;
        if (task) {
            task.cancel();
        }

        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }
        const viewport = page.getViewport({ rotation, scale });

        plugins.forEach((plugin) => {
            if (plugin.onTextLayerRender) {
                plugin.onTextLayerRender({
                    ele: containerEle,
                    pageIndex,
                    scale,
                    status: LayerRenderStatus.PreRender,
                });
            }
        });
        page.getTextContent().then((textContent) => {
            empty();
            renderTask.current = PdfJs.renderTextLayer({
                container: containerEle,
                textContent,
                viewport,
                enhanceTextSelection: true,
            });
            renderTask.current.promise.then(
                () => {
                    const spans: HTMLElement[] = [].slice.call(containerEle.querySelectorAll('span'));
                    spans.forEach((span) => span.classList.add('rpv-core__text-layer-text'));

                    plugins.forEach((plugin) => {
                        if (plugin.onTextLayerRender) {
                            plugin.onTextLayerRender({
                                ele: containerEle,
                                pageIndex,
                                scale,
                                status: LayerRenderStatus.DidRender,
                            });
                        }
                    });
                },
                () => {
                    /**/
                }
            );
        });
    };

    return (
        <WithScale callback={renderText} rotation={rotation} scale={scale}>
            <div className="rpv-core__text-layer" ref={containerRef} />
        </WithScale>
    );
};

export default TextLayer;
