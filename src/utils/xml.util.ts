import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';

@Injectable()
export class XmlUtil {
    /**
     * 将对象转换为xml
     *
     * @param obj 对象
     */
    async convertObjToXml(obj: {}) {
        return new xml2js.Builder({ rootName: 'xml' }).buildObject(obj);
    }

    /**
     * 将xml文本解析为对象
     *
     * @param xml xml文本
     */
    async parseObjFromXml(xml: any) {
        return new Promise((resolve, reject) => {
            xml2js.parseString(xml, { explicitRoot: false, explicitArray: false }, (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
    }
}