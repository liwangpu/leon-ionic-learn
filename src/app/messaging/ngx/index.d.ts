import { IonicNativePlugin } from '@ionic-native/core';
/**
 * @name Messaging
 * @description
 * This plugin does something
 *
 * @usage
 * ```typescript
 * import { Messaging } from '@ionic-native/messaging';
 *
 *
 * constructor(private messaging: Messaging) { }
 *
 * ...
 *
 *
 * this.messaging.functionName('Hello', 123)
 *   .then((res: any) => console.log(res))
 *   .catch((error: any) => console.error(error));
 *
 * ```
 */
export declare class Messaging extends IonicNativePlugin {
    /**
     * This function does something
     * @param arg1 {string} Some param to configure something
     * @param arg2 {number} Another param to configure something
     * @return {Promise<any>} Returns a promise that resolves when something happens
     */
    startService(arg1: string, arg2: number): Promise<any>;
}
