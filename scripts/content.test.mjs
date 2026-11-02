import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../content.js';
test('19 complete lessons plus the app’s final review',()=>{assert.equal(lessons.length,19);assert.equal(new Set(lessons.map(l=>l.place)).size,19);for(const l of lessons){for(const k of ['place','title','story','learn','question','why','keepsake','adult'])assert.ok(l[k]?.length,k);assert.equal(l.choices.length,3);assert.ok(Number.isInteger(l.answer)&&l.answer>=0&&l.answer<3);assert.equal(new Set(l.choices).size,3);}});
test('all answer positions are used',()=>assert.deepEqual([...new Set(lessons.map(l=>l.answer))].sort(),[0,1,2]));
