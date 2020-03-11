import * as path from 'path';
import * as url from 'url';

import * as simplegit from 'simple-git/promise';
import { DefaultLogFields, ListLogLine } from 'simple-git/typings/response';
import * as vscode from 'vscode';

import * as config from './config';
import * as ph from './phabricator';


enum ProviderType {
    PHABRRICATOR = 'phabricator',
}

const PROVIDER_TYPE_VALUES = Object.keys(ProviderType).map(
    key => ProviderType[key as keyof typeof ProviderType]
);

// TODO (ayu): docstrings
async function getBlameCommit(file: string, line: number): Promise<DefaultLogFields & ListLogLine> {
    // TODO (ayu): catch errors
    const log = await simplegit(path.dirname(file)).log([
        '-L',
        `${line},${line}:${file}`,
        '-n',
        '1',
        '--first-parent',
        '-s',
    ]);
    return log.latest;
}

export async function getPullRequestURI(file: string, line: number, provider: config.GitProvider): Promise<vscode.Uri> {
    const commit = await getBlameCommit(file, line);

    switch (provider.type) {
        case ProviderType.PHABRRICATOR:
            const revision = ph.getRevisionID(commit.body);
            const uri = new url.URL(revision, provider.base).toString();
            return vscode.Uri.parse(uri, true);
        default:
            throw new Error(
                `A valid version control provider is required, but got ${provider.type}. ` +
                `Valid values: ${PROVIDER_TYPE_VALUES}`
            );
    }
}
