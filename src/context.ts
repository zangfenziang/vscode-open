import * as path from 'path';
import * as constants from './constants';
import * as range from './range';

interface ContextParameters {
    lines?: range.Range;
    match?: RegExpExecArray;
    lineSeparator?: string;
    linePrefix?: string;
}

export class Context {
    env: NodeJS.ProcessEnv;
    lines: range.Range | null;
    match: RegExpExecArray | null;
    lineSeparator: string;
    linePrefix: string;

    constructor({ lines, match, lineSeparator, linePrefix }: ContextParameters) {
        this.env = {};
        const reg = new RegExp(path.sep, 'g');
        Object.keys(process.env).forEach(name => {
            this.env[name] = process.env[name]?.replace(reg, '/');
        });
        this.lines = lines || null;
        this.match = match || null;
        this.lineSeparator = lineSeparator || constants.DEFAULT_LINE_SEPARATOR;
        this.linePrefix = linePrefix || '';
    }
}
