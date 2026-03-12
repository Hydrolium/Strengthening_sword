import { Sword } from "./sword";

export enum StatTestResult {
    REJECTED_BY_POINT_LACK,
    REJECTED_BY_MAX_UPGRADE,
    SUCCESS,
    SUCCESS_AND_ALL_MAX
}

export type SwordTestResult = SwordTestResult0 | SwordTestResult1;

export enum SwordTestResultType {
    REJECTED_BY_MONEY_LACK,
    REJECTED_BY_MAX_UPGRADE,
    SUCCESS,
    GREAT_SUCCESS,
    FAIL_BUT_INVALIDATED,
    FAIL
}

export interface SwordTestResult0 {
    readonly type: SwordTestResultType.REJECTED_BY_MAX_UPGRADE | SwordTestResultType.REJECTED_BY_MONEY_LACK | SwordTestResultType.FAIL_BUT_INVALIDATED | SwordTestResultType.FAIL;
    readonly result: Sword;
}

export interface SwordTestResult1 {
    readonly type: SwordTestResultType.SUCCESS | SwordTestResultType.GREAT_SUCCESS;
    readonly resultSwordIdx: number;
    readonly oldSword: Sword;
}
