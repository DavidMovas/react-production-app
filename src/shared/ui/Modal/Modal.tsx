import React, { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { classNames } from "../../lib/classNames/classNames";
import { Portal } from "shared/ui/Portal/Portal";
import * as cls from './Modal.module.css';
import { useTheme } from "app/providers/ThemeProvider";


interface ModalProps {
    className?: string;
    children?: ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
    lazy?: boolean;
}

const ANIMATION_CLOSING_DELAY = 300;

export const Modal = (props: ModalProps) => {
    const {
        className,
        children,
        isOpen,
        onClose,
        lazy,
    } = props;

    const [isClosing, setIsClosing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();
    const {theme} = useTheme();

    useEffect(() => {
        if(isOpen) {
            setIsMounted(true);
        }
    }, [isOpen]);

    const closeHandler = useCallback(() => {
        if (onClose) {
            setIsClosing(true);
            timerRef.current = setTimeout(() => {
                onClose();
                setIsClosing(false);
            }, ANIMATION_CLOSING_DELAY);
        }
    }, [onClose]);

    const onContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    }

    const onKeydown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            closeHandler();
        }
    }, [closeHandler]);

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', onKeydown);
        }

        return () => {
            clearTimeout(timerRef.current);
            window.removeEventListener('keydown', onKeydown);
        }
    }, [isOpen, onKeydown]);

    const mods: Record<string, boolean> = {
        [cls.opened]: (isOpen ?? false),
        [cls.isClosing]: (isClosing ?? false),
    };

    if (lazy && !isMounted) {
        return null;
    }

    return (
        <Portal>
            <div className={classNames(cls.Modal, mods, [className, theme,  'app_modal'])}>
                <div className={cls.overlay} onClick={closeHandler}>
                    <div
                        className={cls.content}
                        onClick={onContentClick}>
                        {children}
                    </div>
                </div>
            </div>
        </Portal>
    );
}