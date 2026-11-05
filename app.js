/**
 * Moon - iOS Workout & Fitness Tracker Engine
 * Full offline PWA support, Web Audio synthesized sounds, Haptic feedback
 */

// --- Comprehensive Gym Exercise Database ---
const DEFAULT_EXERCISES = [
  // CHEST
  { id: 'ex_1', name: 'Barbell Bench Press', category: 'Chest' },
  { id: 'ex_2', name: 'Incline Dumbbell Press', category: 'Chest' },
  { id: 'ex_3', name: 'Cable Chest Fly', category: 'Chest' },
  { id: 'ex_4', name: 'Chest Dips', category: 'Chest' },
  { id: 'ex_5', name: 'Push-Ups', category: 'Chest' },
  { id: 'ex_101', name: 'Incline Barbell Bench Press', category: 'Chest' },
  { id: 'ex_102', name: 'Decline Barbell Bench Press', category: 'Chest' },
  { id: 'ex_103', name: 'Flat Dumbbell Press', category: 'Chest' },
  { id: 'ex_104', name: 'Decline Dumbbell Press', category: 'Chest' },
  { id: 'ex_105', name: 'Dumbbell Chest Fly', category: 'Chest' },
  { id: 'ex_106', name: 'Incline Dumbbell Fly', category: 'Chest' },
  { id: 'ex_107', name: 'Pec Deck Fly (Machine)', category: 'Chest' },
  { id: 'ex_108', name: 'Chest Press Machine', category: 'Chest' },
  { id: 'ex_109', name: 'Incline Chest Press Machine', category: 'Chest' },
  { id: 'ex_110', name: 'Low-to-High Cable Fly', category: 'Chest' },
  { id: 'ex_111', name: 'High-to-Low Cable Fly', category: 'Chest' },
  { id: 'ex_112', name: 'Diamond Push-Ups', category: 'Chest' },
  { id: 'ex_113', name: 'Decline Push-Ups', category: 'Chest' },
  { id: 'ex_114', name: 'Dumbbell Pullover', category: 'Chest' },
  { id: 'ex_115', name: 'Smith Machine Bench Press', category: 'Chest' },
  { id: 'ex_116', name: 'Floor Press (Barbell/Dumbbell)', category: 'Chest' },

  // BACK
  { id: 'ex_6', name: 'Barbell Deadlift', category: 'Back' },
  { id: 'ex_7', name: 'Lat Pulldown', category: 'Back' },
  { id: 'ex_8', name: 'Barbell Bent-Over Row', category: 'Back' },
  { id: 'ex_9', name: 'Pull-Ups', category: 'Back' },
  { id: 'ex_10', name: 'Seated Cable Row', category: 'Back' },
  { id: 'ex_29', name: "Farmer's Walk", category: 'Back' },
  { id: 'ex_30', name: 'Hyperextension (Back Extension)', category: 'Back' },
  { id: 'ex_120', name: 'Sumo Deadlift', category: 'Back' },
  { id: 'ex_121', name: 'Chin-Ups (Underhand)', category: 'Back' },
  { id: 'ex_122', name: 'Single-Arm Dumbbell Row', category: 'Back' },
  { id: 'ex_123', name: 'Chest-Supported T-Bar Row', category: 'Back' },
  { id: 'ex_124', name: 'Close-Grip Lat Pulldown (V-Bar)', category: 'Back' },
  { id: 'ex_125', name: 'Straight-Arm Cable Pulldown', category: 'Back' },
  { id: 'ex_126', name: 'Pendlay Row', category: 'Back' },
  { id: 'ex_127', name: 'Meadows Row', category: 'Back' },
  { id: 'ex_128', name: 'Seated Machine Row', category: 'Back' },
  { id: 'ex_129', name: 'Rack Pulls', category: 'Back' },
  { id: 'ex_130', name: 'Good Mornings (Barbell)', category: 'Back' },
  { id: 'ex_131', name: 'Inverted Row', category: 'Back' },
  { id: 'ex_132', name: 'Neutral-Grip Lat Pulldown', category: 'Back' },
  { id: 'ex_133', name: 'Wide-Grip Seated Cable Row', category: 'Back' },

  // SHOULDERS
  { id: 'ex_16', name: 'Overhead Shoulder Press', category: 'Shoulders' },
  { id: 'ex_17', name: 'Dumbbell Lateral Raise', category: 'Shoulders' },
  { id: 'ex_18', name: 'Face Pull', category: 'Shoulders' },
  { id: 'ex_19', name: 'Rear Delt Fly', category: 'Shoulders' },
  { id: 'ex_26', name: 'Barbell Shrugs', category: 'Shoulders' },
  { id: 'ex_27', name: 'Neck Curl & Extension', category: 'Shoulders' },
  { id: 'ex_140', name: 'Seated Dumbbell Shoulder Press', category: 'Shoulders' },
  { id: 'ex_141', name: 'Arnold Press', category: 'Shoulders' },
  { id: 'ex_142', name: 'Cable Lateral Raise', category: 'Shoulders' },
  { id: 'ex_143', name: 'Machine Lateral Raise', category: 'Shoulders' },
  { id: 'ex_144', name: 'Front Dumbbell Raise', category: 'Shoulders' },
  { id: 'ex_145', name: 'Front Plate Raise', category: 'Shoulders' },
  { id: 'ex_146', name: 'Reverse Pec Deck (Machine Rear Delt)', category: 'Shoulders' },
  { id: 'ex_147', name: 'Cable Rear Delt Fly', category: 'Shoulders' },
  { id: 'ex_148', name: 'Upright Row (Barbell/EZ-Bar)', category: 'Shoulders' },
  { id: 'ex_149', name: 'Cable Upright Row', category: 'Shoulders' },
  { id: 'ex_150', name: 'Dumbbell Shrugs', category: 'Shoulders' },
  { id: 'ex_151', name: 'Lu Lateral Raises', category: 'Shoulders' },
  { id: 'ex_152', name: 'Smith Machine Shoulder Press', category: 'Shoulders' },

  // ARMS
  { id: 'ex_20', name: 'Barbell Bicep Curl', category: 'Arms' },
  { id: 'ex_21', name: 'Tricep Rope Pushdown', category: 'Arms' },
  { id: 'ex_22', name: 'Incline Dumbbell Curl', category: 'Arms' },
  { id: 'ex_23', name: 'Skull Crushers', category: 'Arms' },
  { id: 'ex_28', name: 'Hammer Curls & Wrist Curl', category: 'Arms' },
  { id: 'ex_160', name: 'EZ-Bar Bicep Curl', category: 'Arms' },
  { id: 'ex_161', name: 'Alternating Dumbbell Curl', category: 'Arms' },
  { id: 'ex_162', name: 'Dumbbell Hammer Curl', category: 'Arms' },
  { id: 'ex_163', name: 'Preacher Curl (EZ-Bar/Dumbbell)', category: 'Arms' },
  { id: 'ex_164', name: 'Cable Bicep Curl', category: 'Arms' },
  { id: 'ex_165', name: 'Concentration Curl', category: 'Arms' },
  { id: 'ex_166', name: 'Spider Curl', category: 'Arms' },
  { id: 'ex_167', name: 'Reverse Barbell Curl (Forearms)', category: 'Arms' },
  { id: 'ex_168', name: 'Zottman Curl', category: 'Arms' },
  { id: 'ex_169', name: 'Straight Bar Tricep Pushdown', category: 'Arms' },
  { id: 'ex_170', name: 'Overhead Tricep Extension (Dumbbell)', category: 'Arms' },
  { id: 'ex_171', name: 'Overhead Cable Rope Extension', category: 'Arms' },
  { id: 'ex_172', name: 'Tricep Dips (Parallel Bar)', category: 'Arms' },
  { id: 'ex_173', name: 'Bench Dips', category: 'Arms' },
  { id: 'ex_174', name: 'Close-Grip Barbell Bench Press', category: 'Arms' },
  { id: 'ex_175', name: 'Single-Arm Cable Tricep Pushdown', category: 'Arms' },
  { id: 'ex_176', name: 'Dumbbell Tricep Kickback', category: 'Arms' },
  { id: 'ex_177', name: 'JM Press', category: 'Arms' },
  { id: 'ex_178', name: 'Barbell Wrist Curls (Forearms)', category: 'Arms' },

  // LEGS
  { id: 'ex_11', name: 'Barbell Back Squat', category: 'Legs' },
  { id: 'ex_12', name: 'Romanian Deadlift', category: 'Legs' },
  { id: 'ex_13', name: 'Leg Press', category: 'Legs' },
  { id: 'ex_14', name: 'Walking Lunges', category: 'Legs' },
  { id: 'ex_15', name: 'Standing Calf Raise', category: 'Legs' },
  { id: 'ex_31', name: 'Barbell Hip Thrust', category: 'Legs' },
  { id: 'ex_32', name: 'Hip Adduction & Abduction', category: 'Legs' },
  { id: 'ex_180', name: 'Barbell Front Squat', category: 'Legs' },
  { id: 'ex_181', name: 'Goblet Squat (Dumbbell)', category: 'Legs' },
  { id: 'ex_182', name: 'Hack Squat (Machine)', category: 'Legs' },
  { id: 'ex_183', name: 'Bulgarian Split Squat', category: 'Legs' },
  { id: 'ex_184', name: 'Dumbbell Romanian Deadlift', category: 'Legs' },
  { id: 'ex_185', name: 'Leg Extension (Machine)', category: 'Legs' },
  { id: 'ex_186', name: 'Lying Leg Curl (Hamstring)', category: 'Legs' },
  { id: 'ex_187', name: 'Seated Leg Curl', category: 'Legs' },
  { id: 'ex_188', name: 'Seated Calf Raise (Machine)', category: 'Legs' },
  { id: 'ex_189', name: 'Dumbbell Step-Ups', category: 'Legs' },
  { id: 'ex_190', name: 'Glute Bridge', category: 'Legs' },
  { id: 'ex_191', name: 'Hip Abduction Machine (Glutes)', category: 'Legs' },
  { id: 'ex_192', name: 'Hip Adduction Machine (Inner Thigh)', category: 'Legs' },
  { id: 'ex_193', name: 'Sissy Squat', category: 'Legs' },

  // CORE
  { id: 'ex_24', name: 'Hanging Leg Raise', category: 'Core' },
  { id: 'ex_25', name: 'Plank', category: 'Core' },
  { id: 'ex_33', name: 'Russian Twists & Woodchoppers', category: 'Core' },
  { id: 'ex_200', name: 'Cable Kneeling Crunch', category: 'Core' },
  { id: 'ex_201', name: 'Ab Wheel Rollout', category: 'Core' },
  { id: 'ex_202', name: 'Hanging Knee Raise', category: 'Core' },
  { id: 'ex_203', name: 'Decline Weighted Sit-Ups', category: 'Core' },
  { id: 'ex_204', name: 'Side Plank', category: 'Core' },
  { id: 'ex_205', name: 'Cable Woodchopper', category: 'Core' },
  { id: 'ex_206', name: 'Bicycle Crunches', category: 'Core' },
  { id: 'ex_207', name: 'Dragon Flag', category: 'Core' },
  { id: 'ex_208', name: 'Deadbug', category: 'Core' },
  { id: 'ex_209', name: 'Mountain Climbers', category: 'Core' },

  // --- CHEST EXPANSION ---
  { id: 'ex_210', name: 'Incline Dumbbell Press (Neutral Grip)', category: 'Chest' },
  { id: 'ex_211', name: 'Landmine Chest Press (Single Arm)', category: 'Chest' },
  { id: 'ex_212', name: 'Landmine Chest Press (Two Hands)', category: 'Chest' },
  { id: 'ex_213', name: 'Svend Press (Plate/Dumbbell)', category: 'Chest' },
  { id: 'ex_214', name: 'Spoto Press (Paused Bench)', category: 'Chest' },
  { id: 'ex_215', name: 'Larsen Press (Feet-Up Bench)', category: 'Chest' },
  { id: 'ex_216', name: 'Guillotine Press', category: 'Chest' },
  { id: 'ex_217', name: 'Cable Crossover (Mid-Chest)', category: 'Chest' },
  { id: 'ex_218', name: 'Single-Arm Cable Chest Press', category: 'Chest' },
  { id: 'ex_219', name: 'Machine Incline Chest Fly', category: 'Chest' },
  { id: 'ex_220', name: 'Deficit Push-Ups', category: 'Chest' },
  { id: 'ex_221', name: 'Gymnastic Ring Dips', category: 'Chest' },
  { id: 'ex_222', name: 'Archer Push-Ups', category: 'Chest' },
  { id: 'ex_223', name: 'Pike-to-Cobra Push-Ups', category: 'Chest' },
  { id: 'ex_224', name: 'Resistance Band Push-Ups', category: 'Chest' },
  { id: 'ex_225', name: 'Machine-Assisted Chest Dips', category: 'Chest' },
  { id: 'ex_226', name: 'Dumbbell Around the Worlds', category: 'Chest' },
  { id: 'ex_227', name: 'Neutral-Grip Dumbbell Floor Press', category: 'Chest' },

  // --- BACK EXPANSION ---
  { id: 'ex_228', name: 'Deficit Barbell Deadlift', category: 'Back' },
  { id: 'ex_229', name: 'Snatch-Grip Deadlift', category: 'Back' },
  { id: 'ex_230', name: 'Trap Bar (Hex Bar) Deadlift', category: 'Back' },
  { id: 'ex_231', name: 'Block Pulls (High Rack Pull)', category: 'Back' },
  { id: 'ex_232', name: 'Seal Row (Barbell on Bench)', category: 'Back' },
  { id: 'ex_233', name: 'Incline Bench Dumbbell Row', category: 'Back' },
  { id: 'ex_234', name: 'Kroc Rows (Heavy Dumbbell)', category: 'Back' },
  { id: 'ex_235', name: 'Yates Row (Underhand Barbell)', category: 'Back' },
  { id: 'ex_236', name: 'Gorilla Row (Kettlebell/Dumbbell)', category: 'Back' },
  { id: 'ex_237', name: 'Landmine T-Bar Row', category: 'Back' },
  { id: 'ex_238', name: 'Wide-Grip Pull-Ups', category: 'Back' },
  { id: 'ex_239', name: 'Neutral-Grip Pull-Ups', category: 'Back' },
  { id: 'ex_240', name: 'Commando Pull-Ups', category: 'Back' },
  { id: 'ex_241', name: 'Muscle-Up (Bar/Rings)', category: 'Back' },
  { id: 'ex_242', name: 'Single-Arm Cable Lat Pulldown', category: 'Back' },
  { id: 'ex_243', name: 'Kneeling Lat Pulldown', category: 'Back' },
  { id: 'ex_244', name: 'Mag Grip Lat Pulldown', category: 'Back' },
  { id: 'ex_245', name: 'Dumbbell Lat Pullover', category: 'Back' },
  { id: 'ex_246', name: 'Reverse Hyper Extension', category: 'Back' },
  { id: 'ex_247', name: 'Underhand Inverted Row', category: 'Back' },
  { id: 'ex_248', name: 'Weighted 45° Back Extension', category: 'Back' },
  { id: 'ex_249', name: 'Superman Hold (Arch Body)', category: 'Back' },

  // --- SHOULDERS EXPANSION ---
  { id: 'ex_250', name: 'Push Press (Barbell)', category: 'Shoulders' },
  { id: 'ex_251', name: 'Behind-the-Neck Barbell Press', category: 'Shoulders' },
  { id: 'ex_252', name: 'Landmine Overhead Press', category: 'Shoulders' },
  { id: 'ex_253', name: 'Viking Press (Machine/Landmine)', category: 'Shoulders' },
  { id: 'ex_254', name: 'Z-Press (Floor Barbell OHP)', category: 'Shoulders' },
  { id: 'ex_255', name: 'See-Saw Dumbbell Press', category: 'Shoulders' },
  { id: 'ex_256', name: 'High Incline Dumbbell Shoulder Press', category: 'Shoulders' },
  { id: 'ex_257', name: 'Egyptian Cable Lateral Raise', category: 'Shoulders' },
  { id: 'ex_258', name: 'Cross-Body Cable Lateral Raise', category: 'Shoulders' },
  { id: 'ex_259', name: 'Incline Bench Dumbbell Y-Raise', category: 'Shoulders' },
  { id: 'ex_260', name: 'Dumbbell W-Raise', category: 'Shoulders' },
  { id: 'ex_261', name: 'Incline Dumbbell Rear Delt Fly', category: 'Shoulders' },
  { id: 'ex_262', name: 'Overhead Cable Face Pull', category: 'Shoulders' },
  { id: 'ex_263', name: 'Rear Delt Cable Pull-Apart', category: 'Shoulders' },
  { id: 'ex_264', name: 'Resistance Band Pull-Aparts', category: 'Shoulders' },
  { id: 'ex_265', name: 'Hex Bar (Trap Bar) Shrugs', category: 'Shoulders' },
  { id: 'ex_266', name: 'Overhead Barbell Shrugs', category: 'Shoulders' },
  { id: 'ex_267', name: 'Cable Shrugs', category: 'Shoulders' },
  { id: 'ex_268', name: 'Dumbbell Upright Row', category: 'Shoulders' },
  { id: 'ex_269', name: 'Plate Bus Drivers', category: 'Shoulders' },
  { id: 'ex_270', name: 'Plate/Kettlebell Halos', category: 'Shoulders' },

  // --- ARMS EXPANSION (BICEPS, TRICEPS, FOREARMS) ---
  { id: 'ex_271', name: 'Drag Curl (Barbell/Smith)', category: 'Arms' },
  { id: 'ex_272', name: 'Bayonian Cable Curl (Behind-the-Back)', category: 'Arms' },
  { id: 'ex_273', name: 'Cable Preacher Curl', category: 'Arms' },
  { id: 'ex_274', name: 'High Cable Bicep Curl (Hercules)', category: 'Arms' },
  { id: 'ex_275', name: 'Dumbbell Waiter Curl', category: 'Arms' },
  { id: 'ex_276', name: '21s Bicep Curl (Barbell/EZ-Bar)', category: 'Arms' },
  { id: 'ex_277', name: 'Dumbbell Preacher Hammer Curl', category: 'Arms' },
  { id: 'ex_278', name: 'Cross-Body Dumbbell Hammer Curl', category: 'Arms' },
  { id: 'ex_279', name: 'Strict Barbell Curl (Wall-Supported)', category: 'Arms' },
  { id: 'ex_280', name: 'Incline Bench Cable Curl', category: 'Arms' },
  { id: 'ex_281', name: 'Reverse EZ-Bar Curl', category: 'Arms' },
  { id: 'ex_282', name: 'Kettlebell Bicep Curl', category: 'Arms' },
  { id: 'ex_283', name: 'Tate Press (Dumbbell)', category: 'Arms' },
  { id: 'ex_284', name: 'Single-Arm Overhead Dumbbell Extension', category: 'Arms' },
  { id: 'ex_285', name: 'Cross-Body Cable Tricep Extension', category: 'Arms' },
  { id: 'ex_286', name: 'Katana Cable Tricep Extension', category: 'Arms' },
  { id: 'ex_287', name: 'Gymnastic Ring Tricep Dips', category: 'Arms' },
  { id: 'ex_288', name: 'Seated Dip Machine', category: 'Arms' },
  { id: 'ex_289', name: 'California Press', category: 'Arms' },
  { id: 'ex_290', name: 'Floor Skull Crushers (EZ-Bar)', category: 'Arms' },
  { id: 'ex_291', name: 'Cable Tricep Kickback', category: 'Arms' },
  { id: 'ex_292', name: 'French Press (Seated EZ-Bar)', category: 'Arms' },
  { id: 'ex_293', name: 'Plate Pinch Hold (Forearms)', category: 'Arms' },
  { id: 'ex_294', name: 'Dead Hang (Grip & Forearms)', category: 'Arms' },
  { id: 'ex_295', name: 'Wrist Roller (Forearms)', category: 'Arms' },
  { id: 'ex_296', name: 'Dumbbell Reverse Wrist Curls', category: 'Arms' },
  { id: 'ex_297', name: 'Behind-the-Back Barbell Wrist Curls', category: 'Arms' },
  { id: 'ex_298', name: 'Fat Grip Dumbbell Curls', category: 'Arms' },

  // --- LEGS EXPANSION ---
  { id: 'ex_299', name: 'Zercher Squat (Barbell)', category: 'Legs' },
  { id: 'ex_300', name: 'Box Squat (Barbell)', category: 'Legs' },
  { id: 'ex_301', name: 'Paused Back Squat', category: 'Legs' },
  { id: 'ex_302', name: 'Pin Squat (Safety Rack)', category: 'Legs' },
  { id: 'ex_303', name: 'Pistol Squat (Single Leg)', category: 'Legs' },
  { id: 'ex_304', name: 'Cyclist Squat (Elevated Heels)', category: 'Legs' },
  { id: 'ex_305', name: 'Spanish Squat (Band-Assisted)', category: 'Legs' },
  { id: 'ex_306', name: 'Pendulum Squat Machine', category: 'Legs' },
  { id: 'ex_307', name: 'Belt Squat Machine', category: 'Legs' },
  { id: 'ex_308', name: 'Landmine Squat', category: 'Legs' },
  { id: 'ex_309', name: 'Box Step-Ups (Dumbbell)', category: 'Legs' },
  { id: 'ex_310', name: 'Curtsy Lunges', category: 'Legs' },
  { id: 'ex_311', name: 'Deficit Reverse Lunges', category: 'Legs' },
  { id: 'ex_312', name: 'Nordic Hamstring Curl', category: 'Legs' },
  { id: 'ex_313', name: 'Glute-Ham Raise (GHR)', category: 'Legs' },
  { id: 'ex_314', name: 'Single-Leg Romanian Deadlift', category: 'Legs' },
  { id: 'ex_315', name: 'B-Stance Romanian Deadlift', category: 'Legs' },
  { id: 'ex_316', name: 'Stability Ball Hamstring Curl', category: 'Legs' },
  { id: 'ex_317', name: 'Slider Hamstring Curl', category: 'Legs' },
  { id: 'ex_318', name: 'Banded Good Mornings', category: 'Legs' },
  { id: 'ex_319', name: 'Cable Pull-Through (Glutes)', category: 'Legs' },
  { id: 'ex_320', name: 'Sumo Squat (Dumbbell/Kettlebell)', category: 'Legs' },
  { id: 'ex_321', name: 'Kas Glute Bridge (Smith/Barbell)', category: 'Legs' },
  { id: 'ex_322', name: 'Frog Pumps (Dumbbell)', category: 'Legs' },
  { id: 'ex_323', name: 'Cable Glute Kickbacks', category: 'Legs' },
  { id: 'ex_324', name: 'Standing Cable Hip Abduction', category: 'Legs' },
  { id: 'ex_325', name: 'Banded Monster Walks', category: 'Legs' },
  { id: 'ex_326', name: 'Banded Clamshells', category: 'Legs' },
  { id: 'ex_327', name: 'Single-Leg Standing Calf Raise', category: 'Legs' },
  { id: 'ex_328', name: 'Leg Press Calf Raise', category: 'Legs' },
  { id: 'ex_329', name: 'Smith Machine Standing Calf Raise', category: 'Legs' },
  { id: 'ex_330', name: 'Tibialis Raise (Shin & Ankle)', category: 'Legs' },
  { id: 'ex_331', name: 'Donkey Calf Raise', category: 'Legs' },

  // --- CORE & OBLIQUES EXPANSION ---
  { id: 'ex_332', name: "Captain's Chair Leg Raise", category: 'Core' },
  { id: 'ex_333', name: 'Windshield Wipers (Bar/Floor)', category: 'Core' },
  { id: 'ex_334', name: 'Toes-to-Bar', category: 'Core' },
  { id: 'ex_335', name: 'Pallof Press (Cable/Band)', category: 'Core' },
  { id: 'ex_336', name: 'Landmine 180 Rotations', category: 'Core' },
  { id: 'ex_337', name: 'Low-to-High Cable Woodchopper', category: 'Core' },
  { id: 'ex_338', name: 'Cable Side Bend', category: 'Core' },
  { id: 'ex_339', name: 'Dumbbell Side Bend', category: 'Core' },
  { id: 'ex_340', name: 'GHD Sit-Up', category: 'Core' },
  { id: 'ex_341', name: 'V-Ups (Jackknife Crunches)', category: 'Core' },
  { id: 'ex_342', name: 'Flutter Kicks', category: 'Core' },
  { id: 'ex_343', name: 'Scissor Kicks', category: 'Core' },
  { id: 'ex_344', name: 'L-Sit (Floor/Parallettes)', category: 'Core' },
  { id: 'ex_345', name: 'Bird-Dog Hold', category: 'Core' },
  { id: 'ex_346', name: 'Stomach Vacuum', category: 'Core' },
  { id: 'ex_347', name: 'Copenhagen Plank (Adductors & Core)', category: 'Core' },
  { id: 'ex_348', name: 'Bear Crawl', category: 'Core' },
  { id: 'ex_349', name: 'Stir-the-Pot (Stability Ball Plank)', category: 'Core' },
  { id: 'ex_350', name: 'Reverse Crunches', category: 'Core' }
];

const DEFAULT_ROUTINES = [
  {
    id: 'routine_push',
    name: 'Push Power (Chest & Shoulders)',
    tag: 'Chest, Delts, Triceps',
    exerciseIds: ['ex_1', 'ex_2', 'ex_17', 'ex_21'],
    isFeatured: true
  },
  {
    id: 'routine_pull',
    name: 'Pull Strength (Back & Biceps)',
    tag: 'Back, Lats, Biceps',
    exerciseIds: ['ex_6', 'ex_7', 'ex_8', 'ex_20'],
    isFeatured: true
  },
  {
    id: 'routine_legs',
    name: 'Leg Day & Core Hypertrophy',
    tag: 'Quads, Hamstrings, Abs',
    exerciseIds: ['ex_11', 'ex_12', 'ex_13', 'ex_24'],
    isFeatured: true
  },
  {
    id: 'routine_upper',
    name: 'Upper Body Pump',
    tag: 'Chest, Back, Arms',
    exerciseIds: ['ex_1', 'ex_9', 'ex_16', 'ex_20', 'ex_21'],
    isFeatured: true
  },
  {
    id: 'routine_lower',
    name: 'Lower Body & Posterior Chain',
    tag: 'Quads, Hamstrings, Glutes',
    exerciseIds: ['ex_11', 'ex_12', 'ex_182', 'ex_31', 'ex_15'],
    isFeatured: true
  },
  {
    id: 'routine_arnold_chest_back',
    name: 'Arnold Split: Chest & Back',
    tag: 'Chest, Lats, Mid-Back',
    exerciseIds: ['ex_1', 'ex_2', 'ex_8', 'ex_9', 'ex_3'],
    isFeatured: true
  },
  {
    id: 'routine_arnold_arms_delts',
    name: 'Arnold Split: Delts & Arms',
    tag: 'Shoulders, Biceps, Triceps',
    exerciseIds: ['ex_16', 'ex_17', 'ex_20', 'ex_23', 'ex_28', 'ex_21'],
    isFeatured: true
  },
  {
    id: 'routine_calisthenics',
    name: 'Calisthenics & Core Mastery',
    tag: 'Bodyweight & Functional',
    exerciseIds: ['ex_9', 'ex_4', 'ex_5', 'ex_24', 'ex_25'],
    isFeatured: true
  }
];

// Initial state helpers
const STORAGE_KEY = 'ironpulse_app_state_v1';

const DEMO_HISTORY = [
  {
    id: 'hist_demo_1',
    title: 'Upper Body Power (Push & Pull)',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    durationSeconds: 3120,
    volume: 6840,
    unit: 'kg',
    setsCount: 22,
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, bestWeight: 85, bestReps: 8 },
      { name: 'Incline Dumbbell Press', sets: 4, bestWeight: 28, bestReps: 10 },
      { name: 'Barbell Bent-Over Row', sets: 4, bestWeight: 80, bestReps: 10 },
      { name: 'Dumbbell Lateral Raise', sets: 4, bestWeight: 14, bestReps: 12 },
      { name: 'Barbell Bicep Curl', sets: 3, bestWeight: 35, bestReps: 10 },
      { name: 'Tricep Rope Pushdown', sets: 4, bestWeight: 32, bestReps: 12 }
    ]
  },
  {
    id: 'hist_demo_2',
    title: 'Leg Day & Posterior Hypertrophy',
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
    durationSeconds: 3480,
    volume: 8450,
    unit: 'kg',
    setsCount: 18,
    exercises: [
      { name: 'Barbell Back Squat', sets: 5, bestWeight: 120, bestReps: 6 },
      { name: 'Romanian Deadlift', sets: 4, bestWeight: 100, bestReps: 8 },
      { name: 'Leg Press', sets: 5, bestWeight: 220, bestReps: 10 },
      { name: 'Standing Calf Raise', sets: 4, bestWeight: 90, bestReps: 15 }
    ]
  }
];

function rebuildPRsFromHistory(historyList) {
  const prs = {};
  (historyList || []).forEach((h) => {
    (h.exercises || []).forEach((ex) => {
      const w = Number(ex.bestWeight) || 0;
      const r = Number(ex.bestReps) || 0;
      if (w > 0) {
        if (!prs[ex.name] || w > prs[ex.name].weight || (w === prs[ex.name].weight && r > prs[ex.name].reps)) {
          prs[ex.name] = { weight: w, reps: r, date: h.date };
        }
      }
    });
  });
  return prs;
}

function syncDemoState(state) {
  state.settings = state.settings || {};
  state.exercises = state.exercises || [...DEFAULT_EXERCISES];
  const existingNames = new Set(state.exercises.map(e => (e.name || '').toLowerCase()));
  DEFAULT_EXERCISES.forEach(def => {
    if (!existingNames.has(def.name.toLowerCase())) {
      state.exercises.push({ ...def });
    }
  });

  state.deletedRoutineIds = state.deletedRoutineIds || [];
  
  // Filter out default/featured routines from Saved Routines per user request.
  // Featured routines now live in the + New Routine -> Featured Templates builder tab.
  const defaultIdSet = new Set(DEFAULT_ROUTINES.map(d => d.id));
  state.routines = (state.routines || []).filter(r => !r.isFeatured && !defaultIdSet.has(r.id));

  const demoOn = state.settings.demoMode === true;
  const realHistory = (state.history || []).filter(h => h.id !== 'hist_demo_1' && h.id !== 'hist_demo_2');
  state.history = demoOn ? [...realHistory, ...DEMO_HISTORY] : realHistory;
  state.prs = rebuildPRsFromHistory(state.history);
  return state;
}

function getInitialState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return syncDemoState(parsed);
    } catch (e) {
      console.error('Failed to parse saved state', e);
    }
  }

  // Clean initial state with demo mode disabled by default
  return {
    settings: {
      unit: 'kg',
      defaultRest: 90,
      sound: true,
      haptics: true,
      demoMode: false,
      dmOnlyMode: true
    },
    exercises: [...DEFAULT_EXERCISES],
    routines: [], // Custom saved routines only (featured ones are in template library)
    deletedRoutineIds: [],
    history: [],
    prs: {},
    activeWorkout: null
  };
}

let AppState = getInitialState();
saveState();

// Doomscroll bank: balance (seconds earned), session (ms epoch when the current scroll session ends)
function ensureScrollState() {
  if (!AppState.scroll) {
    AppState.scroll = {
      balance: 0,
      sessionEndsAt: null,
      earnedTotal: 0,
      antiScrollActive: true,
      antiScrollStartedAt: Date.now()
    };
  }
  if (typeof AppState.scroll.antiScrollActive !== 'boolean') {
    AppState.scroll.antiScrollActive = true;
    AppState.scroll.antiScrollStartedAt = Date.now();
  }
}
ensureScrollState();

function ensureFocusBlockState() {
  if (!AppState.focusBlock) {
    AppState.focusBlock = {
      instantActive: false,
      instantEndsAt: null,
      instantDurationMinutes: 15,
      schedule: {
        enabled: true,
        startTime: '09:00',
        endTime: '17:00',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      },
      targets: {
        youtubeShorts: true,
        games: true,
        instagramReels: true,
        tiktok: true,
        customApps: ['Subway Surfers', 'Roblox']
      }
    };
  }
  if (!AppState.focusBlock.targets) {
    AppState.focusBlock.targets = {
      youtubeShorts: true,
      games: true,
      instagramReels: true,
      tiktok: true,
      customApps: ['Subway Surfers', 'Roblox']
    };
  }
  if (!Array.isArray(AppState.focusBlock.targets.customApps)) {
    AppState.focusBlock.targets.customApps = ['Subway Surfers', 'Roblox'];
  }
  if (!AppState.focusBlock.schedule) {
    AppState.focusBlock.schedule = {
      enabled: true,
      startTime: '09:00',
      endTime: '17:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    };
  }
}
ensureFocusBlockState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState));
}

// --- Web Audio Synthesizer (Zero asset dependency) ---
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, type, duration, delay = 0) {
  if (!AppState.settings.sound) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

    gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  } catch (e) {
    console.warn('Audio tone error', e);
  }
}

function playSetCompletePing() {
  playTone(880, 'sine', 0.15, 0); // A5 note
  playTone(1174.66, 'sine', 0.25, 0.08); // D6 high note
}

function playRestTimerChime() {
  // Triple athletic boxing bell alert chime with high-resonance harmonics
  try {
    playTone(784.0, 'sine', 0.35, 0);       // G5
    playTone(1568.0, 'triangle', 0.25, 0);   // G6
    playTone(880.0, 'sine', 0.45, 0.18);     // A5
    playTone(1760.0, 'triangle', 0.3, 0.18);  // A6
    playTone(1174.66, 'sine', 0.9, 0.38);    // D6 long ringing chime
    playTone(2349.32, 'triangle', 0.5, 0.38);// D7 chime harmonic
  } catch (e) {}

  // HTML Audio element trigger
  try {
    const audioEl = document.getElementById('rest-timer-audio');
    if (audioEl) {
      audioEl.currentTime = 0;
      audioEl.play().catch(() => {});
    }
  } catch (e) {}
}

function triggerHaptic(pattern = [40]) {
  if (AppState.settings.haptics && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {}
  }
}

// --- Active Workout Runtime & Timer ---
let workoutTimerInterval = null;
let restTimerInterval = null;
let restTimeRemaining = 0;
let restTotalDuration = 90;
let restEndsAt = 0;

function notifyRestOver() {
  const title = 'Moon Fitness - Rest Target Reached! 🔔';
  const body = 'Rest period complete! Step up for your next set.';
  try {
    if ('Notification' in window && Notification.permission === 'granted') {
      if (navigator.serviceWorker && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification(title, {
            body: body,
            icon: 'app_icon_192.png',
            badge: 'apple-touch-icon.png',
            vibrate: [500, 200, 500, 200, 500],
            tag: 'rest-timer-done',
            renotify: true,
            requireInteraction: true,
            silent: false,
            data: { url: './#workout' }
          }).catch(() => new Notification(title, { body, icon: 'app_icon_192.png' }));
        });
      } else {
        new Notification(title, { body, icon: 'app_icon_192.png' });
      }
    }
  } catch (e) {}
}

function requestNotifyPermission() {
  try {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') {
          showToast('🔔 Rest timer push notifications enabled');
        }
      });
    }
  } catch (e) {}
}

function showToast(msg) {
  let t = document.getElementById('moon-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'moon-toast';
    t.className = 'moon-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), 3500);
}

function startWorkoutTimer() {
  if (workoutTimerInterval) clearInterval(workoutTimerInterval);
  workoutTimerInterval = setInterval(() => {
    if (!AppState.activeWorkout) return;
    const elapsed = Math.floor((Date.now() - AppState.activeWorkout.startTime) / 1000);
    renderTimerDisplays(elapsed);
  }, 1000);
}

function formatDuration(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function renderTimerDisplays(elapsed) {
  const formatted = formatDuration(elapsed);
  const activeTimerEl = document.getElementById('active-timer-display');
  const bannerTimerEl = document.getElementById('banner-timer');
  if (activeTimerEl) activeTimerEl.textContent = formatted;
  if (bannerTimerEl) bannerTimerEl.textContent = formatted;
}

// --- Rest Timer Floating Bar (Countdown + Count-Up Stopwatch) ---
let restTimerMode = 'countdown'; // 'countdown' | 'stopwatch'
let restStartedAt = 0;
let restStopwatchPaused = false;

function triggerRestTimer(seconds) {
  restTimerMode = 'countdown';
  restStartedAt = Date.now();
  restTotalDuration = seconds || (AppState.activeWorkout && AppState.activeWorkout.restSeconds) || AppState.settings.defaultRest || 90;
  restTimeRemaining = restTotalDuration;
  restEndsAt = Date.now() + restTotalDuration * 1000;
  restStopwatchPaused = false;

  const bar = document.getElementById('rest-timer-bar');
  if (bar) bar.classList.remove('hidden');
  document.body.classList.add('has-active-rest-bar');

  updateRestTimerUI();

  // Ensure notification permission and schedule background wake with Service Worker
  requestNotifyPermission();
  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_REST_TIMER',
        delayMs: restTotalDuration * 1000,
        title: 'Moon Fitness - Rest Target Reached! 🔔',
        body: 'Time for your next set! Mechanical tension awaits.'
      });
    }
  } catch (e) {}

  if (restTimerInterval) clearInterval(restTimerInterval);
  restTimerInterval = setInterval(tickRestTimer, 1000);
}

function tickRestTimer() {
  if (restTimerMode === 'countdown') {
    restTimeRemaining = Math.max(0, Math.ceil((restEndsAt - Date.now()) / 1000));
    if (restTimeRemaining <= 0) {
      // Countdown finished
      playRestTimerChime();
      triggerHaptic([100, 50, 100, 50, 200]);
      notifyRestOver();
      showToast('\u23F1\uFE0F Rest target reached! Tap to begin next set.');

      // Transition smoothly into overtime count-up so user sees extra rest taken
      restTimerMode = 'stopwatch';
      restStartedAt = restEndsAt;
      updateRestTimerUI();
    } else {
      updateRestTimerUI();
    }
  } else {
    // Stopwatch Count-Up mode
    if (!restStopwatchPaused) {
      updateRestTimerUI();
    }
  }
}

function toggleRestStopwatchMode() {
  if (restTimerMode === 'countdown') {
    // Switch Countdown -> Count-Up Stopwatch
    restTimerMode = 'stopwatch';
    const restedSecs = Math.max(0, restTotalDuration - restTimeRemaining);
    restStartedAt = Date.now() - (restedSecs * 1000);
    restStopwatchPaused = false;
    triggerHaptic([40]);
    showToast('\u23F1\uFE0F Rest Stopwatch active (Counting Up)');
  } else {
    // Switch Count-Up -> Countdown
    restTimerMode = 'countdown';
    restTimeRemaining = restTotalDuration;
    restEndsAt = Date.now() + restTotalDuration * 1000;
    triggerHaptic([40]);
    showToast(`\u23F3 Rest countdown reset to ${restTotalDuration}s`);
  }
  updateRestTimerUI();
}

function updateRestTimerUI() {
  const textEl = document.getElementById('rest-timer-text');
  const ringFill = document.getElementById('timer-ring-fill');
  const tagEl = document.getElementById('rest-timer-tag');
  const modeTagEl = document.getElementById('rest-timer-mode-tag');
  const subEl = document.getElementById('rest-timer-sub');
  const toggleBtn = document.getElementById('timer-btn-mode-toggle');
  const minusBtn = document.getElementById('timer-btn-minus');
  const plusBtn = document.getElementById('timer-btn-plus');

  const circumference = 113.09; // 2 * PI * 18

  if (restTimerMode === 'countdown') {
    if (tagEl) tagEl.textContent = 'RESTING';
    if (modeTagEl) modeTagEl.textContent = 'COUNTDOWN';
    if (subEl) subEl.textContent = 'Next set coming up \u2022 \u23F1\uFE0F Count Up available';
    if (toggleBtn) toggleBtn.textContent = '\u23F1\uFE0F Count Up';
    if (minusBtn) minusBtn.textContent = '-15s';
    if (plusBtn) plusBtn.textContent = '+30s';
    if (textEl) {
      textEl.textContent = restTimeRemaining;
      textEl.style.color = 'var(--accent-lime)';
    }
    if (ringFill) {
      const progress = Math.max(0, Math.min(1, restTimeRemaining / restTotalDuration));
      ringFill.style.stroke = 'var(--accent-lime)';
      ringFill.style.strokeDashoffset = circumference * (1 - progress);
    }
  } else {
    // Count-Up Stopwatch mode
    const elapsedSecs = Math.max(0, Math.floor((Date.now() - restStartedAt) / 1000));
    const m = Math.floor(elapsedSecs / 60);
    const s = elapsedSecs % 60;
    const formatted = m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${s}s`;

    const isOvertime = restEndsAt > 0 && Date.now() > restEndsAt;
    if (tagEl) tagEl.textContent = isOvertime ? 'REST OVERTIME' : 'REST STOPWATCH';
    if (modeTagEl) modeTagEl.textContent = 'COUNTING UP';
    if (subEl) subEl.textContent = isOvertime ? 'Past target rest \u2022 Tap Skip when ready' : 'Open-ended rest \u2022 Count-up active';
    if (toggleBtn) toggleBtn.textContent = '\u23F3 Countdown';
    if (minusBtn) minusBtn.textContent = restStopwatchPaused ? '\u25B6 Resume' : '\u23F8 Pause';
    if (plusBtn) plusBtn.textContent = 'Reset';
    if (textEl) {
      textEl.textContent = formatted;
      textEl.style.color = isOvertime ? 'var(--accent-crimson)' : 'var(--accent-cyan)';
    }
    if (ringFill) {
      ringFill.style.stroke = isOvertime ? 'var(--accent-crimson)' : 'var(--accent-cyan)';
      const sweepProgress = (elapsedSecs % 60) / 60;
      ringFill.style.strokeDashoffset = circumference * (1 - sweepProgress);
    }
  }
}

function closeRestTimer() {
  if (restTimerInterval) clearInterval(restTimerInterval);
  restTimerInterval = null;
  const bar = document.getElementById('rest-timer-bar');
  if (bar) bar.classList.add('hidden');
  document.body.classList.remove('has-active-rest-bar');
}

// --- High-Precision Stopwatch & Countdown Timer Engine ---
const StopwatchState = {
  activeToolMode: 'stopwatch', // 'stopwatch' | 'timer'
  running: false,
  startTime: 0,
  elapsed: 0,
  laps: [],
  targetSeconds: 0,
  targetFired: false,
  minimizedDismissed: false,
  _rafId: null,
  _bgInterval: null
};

const CountdownTimerState = {
  running: false,
  durationMs: 60000, // 60s default
  remainingMs: 60000,
  endsAt: 0,
  completed: false,
  _rafId: null,
  _bgInterval: null
};

function formatStopwatchTime(ms) {
  if (ms < 0 || isNaN(ms)) ms = 0;
  const totalHundredths = Math.floor(ms / 10);
  const cs = (totalHundredths % 100).toString().padStart(2, '0');
  const totalSec = Math.floor(ms / 1000);
  const s = (totalSec % 60).toString().padStart(2, '0');
  const m = (Math.floor(totalSec / 60) % 60).toString().padStart(2, '0');
  const h = Math.floor(totalSec / 3600);
  const minSec = h > 0 ? `${h.toString().padStart(2, '0')}:${m}:${s}` : `${m}:${s}`;
  return { minSec, cs: `.${cs}`, full: `${minSec}.${cs}`, totalMs: ms, totalSec };
}

function playStopwatchTickSound() {
  playTone(880, 'sine', 0.08, 0);
}

function playStopwatchTargetSound() {
  playTone(587.33, 'triangle', 0.2, 0);
  playTone(880, 'sine', 0.25, 0.12);
  playTone(1174.66, 'sine', 0.5, 0.25);
}

function switchClockToolMode(mode) {
  StopwatchState.activeToolMode = mode === 'timer' ? 'timer' : 'stopwatch';
  const isTimer = StopwatchState.activeToolMode === 'timer';

  document.querySelectorAll('.sw-mode-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.swMode === StopwatchState.activeToolMode);
  });

  const inlineSwChips = document.getElementById('inline-sw-chips');
  const inlineTimerChips = document.getElementById('inline-timer-chips');
  if (inlineSwChips) inlineSwChips.classList.toggle('hidden', isTimer);
  if (inlineTimerChips) inlineTimerChips.classList.toggle('hidden', !isTimer);

  const modalSwTargets = document.getElementById('modal-sw-target-row');
  const modalTimerConfig = document.getElementById('modal-timer-config-row');
  const modalLapsWrap = document.getElementById('sw-modal-laps-wrap');
  if (modalSwTargets) modalSwTargets.classList.toggle('hidden', isTimer);
  if (modalTimerConfig) modalTimerConfig.classList.toggle('hidden', !isTimer);
  if (modalLapsWrap) modalLapsWrap.classList.toggle('hidden', isTimer);

  const inlineHeaderIcon = document.getElementById('inline-sw-header-icon');
  const modalIcon = document.getElementById('sw-modal-icon');
  if (inlineHeaderIcon) inlineHeaderIcon.textContent = isTimer ? '\u23F3' : '\u23F1\uFE0F';
  if (modalIcon) modalIcon.textContent = isTimer ? '\u23F3' : '\u23F1\uFE0F';

  triggerHaptic([20]);
  renderStopwatchUI();
}

// --- Countdown Timer Functions ---
function syncCustomTimerInputs(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  const iMin = document.getElementById('inline-timer-min');
  const iSec = document.getElementById('inline-timer-sec');
  const mMin = document.getElementById('modal-timer-min');
  const mSec = document.getElementById('modal-timer-sec');
  if (iMin) iMin.value = m;
  if (iSec) iSec.value = s;
  if (mMin) mMin.value = m;
  if (mSec) mSec.value = s;

  document.querySelectorAll('.timer-preset-chip').forEach(chip => {
    chip.classList.toggle('active', Number(chip.dataset.tsec) === totalSec);
  });
}

function setCountdownTimerDuration(seconds) {
  const sec = Math.max(1, Number(seconds) || 60);
  CountdownTimerState.durationMs = sec * 1000;
  CountdownTimerState.remainingMs = CountdownTimerState.durationMs;
  CountdownTimerState.completed = false;
  if (CountdownTimerState.running) {
    CountdownTimerState.endsAt = performance.now() + CountdownTimerState.remainingMs;
  }
  syncCustomTimerInputs(sec);
  triggerHaptic([20]);
  renderStopwatchUI();
}

function applyCustomTimerInputs(source) {
  const minEl = document.getElementById(source === 'inline' ? 'inline-timer-min' : 'modal-timer-min');
  const secEl = document.getElementById(source === 'inline' ? 'inline-timer-sec' : 'modal-timer-sec');
  const m = Math.max(0, Math.min(99, parseInt(minEl ? minEl.value : '1', 10) || 0));
  const s = Math.max(0, Math.min(59, parseInt(secEl ? secEl.value : '0', 10) || 0));
  const totalSec = Math.max(1, m * 60 + s);
  setCountdownTimerDuration(totalSec);
}

function adjustCountdownTimer(deltaSec) {
  const deltaMs = (Number(deltaSec) || 0) * 1000;
  if (CountdownTimerState.running) {
    CountdownTimerState.remainingMs = Math.max(1000, CountdownTimerState.remainingMs + deltaMs);
    CountdownTimerState.endsAt = performance.now() + CountdownTimerState.remainingMs;
    if (CountdownTimerState.remainingMs > CountdownTimerState.durationMs) {
      CountdownTimerState.durationMs = CountdownTimerState.remainingMs;
    }
  } else {
    const newDur = Math.max(5000, CountdownTimerState.durationMs + deltaMs);
    CountdownTimerState.durationMs = newDur;
    CountdownTimerState.remainingMs = newDur;
    CountdownTimerState.completed = false;
    syncCustomTimerInputs(Math.round(newDur / 1000));
  }
  triggerHaptic([25]);
  renderStopwatchUI();
}

function startCountdownTimer() {
  if (CountdownTimerState.running) return;
  if (CountdownTimerState.remainingMs <= 0 || CountdownTimerState.completed) {
    CountdownTimerState.remainingMs = CountdownTimerState.durationMs;
  }
  CountdownTimerState.running = true;
  CountdownTimerState.completed = false;
  CountdownTimerState.endsAt = performance.now() + CountdownTimerState.remainingMs;
  StopwatchState.minimizedDismissed = false;

  playStopwatchTickSound();
  triggerHaptic([40]);
  renderStopwatchUI();

  if (CountdownTimerState._rafId) cancelAnimationFrame(CountdownTimerState._rafId);
  function loop() {
    if (!CountdownTimerState.running) return;
    tickCountdownTimer();
    CountdownTimerState._rafId = requestAnimationFrame(loop);
  }
  CountdownTimerState._rafId = requestAnimationFrame(loop);

  if (CountdownTimerState._bgInterval) clearInterval(CountdownTimerState._bgInterval);
  CountdownTimerState._bgInterval = setInterval(tickCountdownTimer, 200);
}

function pauseCountdownTimer() {
  if (!CountdownTimerState.running) return;
  CountdownTimerState.running = false;
  CountdownTimerState.remainingMs = Math.max(0, CountdownTimerState.endsAt - performance.now());
  if (CountdownTimerState._rafId) cancelAnimationFrame(CountdownTimerState._rafId);
  if (CountdownTimerState._bgInterval) clearInterval(CountdownTimerState._bgInterval);
  triggerHaptic([30]);
  renderStopwatchUI();
}

function toggleCountdownTimer() {
  if (CountdownTimerState.running) {
    pauseCountdownTimer();
  } else {
    startCountdownTimer();
  }
}

function resetCountdownTimer() {
  CountdownTimerState.running = false;
  CountdownTimerState.remainingMs = CountdownTimerState.durationMs;
  CountdownTimerState.completed = false;
  if (CountdownTimerState._rafId) cancelAnimationFrame(CountdownTimerState._rafId);
  if (CountdownTimerState._bgInterval) clearInterval(CountdownTimerState._bgInterval);
  triggerHaptic([20, 30]);
  renderStopwatchUI();
}

function tickCountdownTimer() {
  if (!CountdownTimerState.running) return;
  CountdownTimerState.remainingMs = Math.max(0, CountdownTimerState.endsAt - performance.now());

  if (CountdownTimerState.remainingMs <= 0) {
    CountdownTimerState.running = false;
    CountdownTimerState.remainingMs = 0;
    CountdownTimerState.completed = true;
    if (CountdownTimerState._rafId) cancelAnimationFrame(CountdownTimerState._rafId);
    if (CountdownTimerState._bgInterval) clearInterval(CountdownTimerState._bgInterval);

    playRestTimerChime();
    triggerHaptic([140, 70, 140, 70, 260]);
    notifyRestOver();
    showToast('\u23F3 Timer finished!');
    renderStopwatchUI();
    return;
  }

  if (StopwatchState.activeToolMode === 'timer') {
    updateClockDisplayValues();
  } else {
    updateFloatingAndHeaderClockUI();
  }
}

// --- Stopwatch Functions ---
function startStopwatch() {
  if (StopwatchState.running) return;
  StopwatchState.running = true;
  StopwatchState.startTime = performance.now() - StopwatchState.elapsed;
  StopwatchState.targetFired = false;
  StopwatchState.minimizedDismissed = false;

  playStopwatchTickSound();
  triggerHaptic([40]);
  renderStopwatchUI();

  if (StopwatchState._rafId) cancelAnimationFrame(StopwatchState._rafId);
  function loop() {
    if (!StopwatchState.running) return;
    tickStopwatch();
    StopwatchState._rafId = requestAnimationFrame(loop);
  }
  StopwatchState._rafId = requestAnimationFrame(loop);

  if (StopwatchState._bgInterval) clearInterval(StopwatchState._bgInterval);
  StopwatchState._bgInterval = setInterval(tickStopwatch, 200);
}

function pauseStopwatch() {
  if (!StopwatchState.running) return;
  StopwatchState.running = false;
  StopwatchState.elapsed = Math.max(0, performance.now() - StopwatchState.startTime);
  if (StopwatchState._rafId) cancelAnimationFrame(StopwatchState._rafId);
  if (StopwatchState._bgInterval) clearInterval(StopwatchState._bgInterval);
  triggerHaptic([30]);
  renderStopwatchUI();
}

function toggleStopwatch() {
  if (StopwatchState.running) {
    pauseStopwatch();
  } else {
    startStopwatch();
  }
}

function resetStopwatch() {
  StopwatchState.running = false;
  StopwatchState.elapsed = 0;
  StopwatchState.startTime = 0;
  StopwatchState.laps = [];
  StopwatchState.targetFired = false;
  if (StopwatchState._rafId) cancelAnimationFrame(StopwatchState._rafId);
  if (StopwatchState._bgInterval) clearInterval(StopwatchState._bgInterval);
  triggerHaptic([20, 30]);
  renderStopwatchUI();
}

function recordStopwatchLap() {
  const currentElapsed = StopwatchState.running 
    ? Math.max(0, performance.now() - StopwatchState.startTime) 
    : StopwatchState.elapsed;
  if (currentElapsed <= 0) return;

  const prevSplit = StopwatchState.laps.length > 0 ? StopwatchState.laps[0].splitTime : 0;
  const lapDuration = Math.max(0, currentElapsed - prevSplit);
  const lap = {
    num: StopwatchState.laps.length + 1,
    lapTime: lapDuration,
    splitTime: currentElapsed
  };
  StopwatchState.laps.unshift(lap); // Newest on top
  playTone(1046.5, 'sine', 0.1, 0); // High C6 ping
  triggerHaptic([30, 40]);
  renderStopwatchLaps();
  renderStopwatchUI();
}

function toggleActiveClockTool() {
  if (StopwatchState.activeToolMode === 'timer') {
    toggleCountdownTimer();
  } else {
    toggleStopwatch();
  }
}

function resetActiveClockTool() {
  if (StopwatchState.activeToolMode === 'timer') {
    resetCountdownTimer();
  } else {
    resetStopwatch();
  }
}

function secondaryActiveClockAction() {
  if (StopwatchState.activeToolMode === 'timer') {
    if (CountdownTimerState.running) {
      adjustCountdownTimer(15);
      showToast('\u23F3 +15s added to timer');
    } else {
      resetCountdownTimer();
    }
  } else {
    if (StopwatchState.running) {
      recordStopwatchLap();
    } else {
      resetStopwatch();
    }
  }
}

function handleStopwatchSecondaryAction() {
  secondaryActiveClockAction();
}

function clearStopwatchLaps() {
  StopwatchState.laps = [];
  renderStopwatchLaps();
}

function setStopwatchTarget(seconds) {
  StopwatchState.targetSeconds = Number(seconds) || 0;
  StopwatchState.targetFired = false;
  document.querySelectorAll('.sw-target-chip').forEach(chip => {
    chip.classList.toggle('active', Number(chip.dataset.sec) === StopwatchState.targetSeconds);
  });
  document.querySelectorAll('#inline-sw-chips .sw-chip').forEach(chip => {
    chip.classList.toggle('active', Number(chip.dataset.sec) === StopwatchState.targetSeconds);
  });
  triggerHaptic([20]);
}

window.setInlineStopwatchTarget = function(sec) {
  setStopwatchTarget(sec);
};

function tickStopwatch() {
  if (StopwatchState.running) {
    StopwatchState.elapsed = Math.max(0, performance.now() - StopwatchState.startTime);
  }
  const curMs = StopwatchState.elapsed;
  const time = formatStopwatchTime(curMs);

  // Target alert check (e.g., for timed plank, holds, or rest)
  if (StopwatchState.running && StopwatchState.targetSeconds > 0 && !StopwatchState.targetFired) {
    if (time.totalSec >= StopwatchState.targetSeconds) {
      StopwatchState.targetFired = true;
      playStopwatchTargetSound();
      triggerHaptic([120, 60, 120, 60, 200]);
      showToast(`\u23F1\uFE0F Target ${StopwatchState.targetSeconds}s reached!`);
    }
  }

  if (StopwatchState.activeToolMode === 'stopwatch') {
    updateClockDisplayValues();
  } else {
    updateFloatingAndHeaderClockUI();
  }
}

function updateFloatingAndHeaderClockUI() {
  // Prefer whichever clock is actively running, or the activeToolMode
  let useTimer = StopwatchState.activeToolMode === 'timer';
  if (CountdownTimerState.running && !StopwatchState.running) useTimer = true;
  if (StopwatchState.running && !CountdownTimerState.running) useTimer = false;

  const running = useTimer ? CountdownTimerState.running : StopwatchState.running;
  const ms = useTimer ? CountdownTimerState.remainingMs : StopwatchState.elapsed;
  const hasProgress = useTimer
    ? (CountdownTimerState.running || CountdownTimerState.remainingMs < CountdownTimerState.durationMs)
    : (StopwatchState.running || StopwatchState.elapsed > 0);
  const time = formatStopwatchTime(ms);

  const pillDigits = document.getElementById('sw-pill-digits');
  const pillPlayBtn = document.getElementById('sw-pill-play-btn');
  const pillIcon = document.getElementById('sw-pill-icon');
  if (pillDigits) {
    const tenths = Math.floor(parseInt(time.cs.slice(1)) / 10);
    pillDigits.textContent = `${time.minSec}.${tenths}`;
  }
  if (pillPlayBtn) pillPlayBtn.textContent = running ? '\u23F8' : '\u25B6';
  if (pillIcon) pillIcon.textContent = useTimer ? '\u23F3' : '\u23F1\uFE0F';

  const pillEl = document.getElementById('floating-stopwatch-pill');
  const modalEl = document.getElementById('modal-stopwatch');
  const isModalOpen = modalEl && !modalEl.classList.contains('hidden');
  if (pillEl) {
    if (hasProgress && !isModalOpen && !StopwatchState.minimizedDismissed) {
      pillEl.classList.remove('hidden');
    } else {
      pillEl.classList.add('hidden');
    }
  }

  const headerLabel = document.getElementById('header-stopwatch-label');
  const headerBtn = document.getElementById('header-stopwatch-btn');
  if (headerLabel && headerBtn) {
    if (running) {
      headerLabel.textContent = time.minSec;
      headerBtn.classList.add('active-running');
      headerBtn.classList.remove('active-paused');
    } else if (hasProgress) {
      headerLabel.textContent = `${time.minSec} \u23F8`;
      headerBtn.classList.add('active-paused');
      headerBtn.classList.remove('active-running');
    } else {
      headerLabel.textContent = 'Stopwatch';
      headerBtn.classList.remove('active-running', 'active-paused');
    }
  }
}

function updateClockDisplayValues() {
  const isTimer = StopwatchState.activeToolMode === 'timer';
  const running = isTimer ? CountdownTimerState.running : StopwatchState.running;
  const curMs = isTimer ? CountdownTimerState.remainingMs : StopwatchState.elapsed;
  const time = formatStopwatchTime(curMs);
  const isPaused = isTimer
    ? (!running && CountdownTimerState.remainingMs < CountdownTimerState.durationMs && CountdownTimerState.remainingMs > 0)
    : (!running && StopwatchState.elapsed > 0);
  const statusText = running
    ? (isTimer ? 'COUNTDOWN' : 'RUNNING')
    : (CountdownTimerState.completed && isTimer ? "TIME'S UP!" : (isPaused ? 'PAUSED' : 'READY'));
  const statusClass = running ? 'running' : (isPaused ? 'paused' : 'ready');

  // 1. Modal displays
  const modalDigits = document.getElementById('sw-modal-digits');
  const modalCentis = document.getElementById('sw-modal-centis');
  const modalStatus = document.getElementById('sw-modal-status');
  const sweepCircle = document.getElementById('sw-dial-sweep');
  if (modalDigits) modalDigits.textContent = time.minSec;
  if (modalCentis) modalCentis.textContent = time.cs;
  if (modalStatus) {
    modalStatus.textContent = statusText;
    modalStatus.className = 'sw-state-tag ' + statusClass;
  }
  if (sweepCircle) {
    const sweepCircumference = 603.18; // 2 * PI * 96
    const secProgress = isTimer
      ? Math.max(0, Math.min(1, CountdownTimerState.remainingMs / Math.max(1000, CountdownTimerState.durationMs)))
      : (time.totalMs % 60000) / 60000;
    sweepCircle.style.strokeDashoffset = sweepCircumference * (1 - secProgress);
  }

  // 2. Inline Workout Widget displays
  const inlineDigits = document.getElementById('inline-sw-digits');
  const inlineCentis = document.getElementById('inline-sw-centis');
  const inlineState = document.getElementById('inline-sw-state');
  const inlineToggleLabel = document.getElementById('inline-sw-toggle-label');
  const inlineToggleIcon = document.getElementById('inline-sw-toggle-icon');
  const inlineToggleBtn = document.getElementById('inline-sw-toggle-btn');
  const inlineLapBtn = document.getElementById('inline-sw-lap-btn');
  if (inlineDigits) inlineDigits.textContent = time.minSec;
  if (inlineCentis) inlineCentis.textContent = time.cs;
  if (inlineState) {
    inlineState.textContent = statusText;
    inlineState.className = 'sw-badge-state ' + statusClass;
  }
  if (inlineToggleLabel) inlineToggleLabel.textContent = running ? 'Pause' : (isPaused ? 'Resume' : 'Start');
  if (inlineToggleIcon) inlineToggleIcon.textContent = running ? '\u23F8' : '\u25B6';
  if (inlineToggleBtn) {
    inlineToggleBtn.className = 'sw-action-btn sw-btn-primary ' + (running ? 'stop' : 'start');
  }
  if (inlineLapBtn) {
    inlineLapBtn.textContent = isTimer ? '+15s' : 'Lap';
  }

  updateFloatingAndHeaderClockUI();
}

function renderStopwatchUI() {
  updateClockDisplayValues();

  const isTimer = StopwatchState.activeToolMode === 'timer';
  const running = isTimer ? CountdownTimerState.running : StopwatchState.running;
  const isPaused = isTimer
    ? (!running && CountdownTimerState.remainingMs < CountdownTimerState.durationMs && CountdownTimerState.remainingMs > 0)
    : (!running && StopwatchState.elapsed > 0);

  // Modal primary/secondary button states
  const primaryBtn = document.getElementById('sw-modal-primary-btn');
  const primaryLabel = document.getElementById('sw-modal-primary-label');
  const secondaryBtn = document.getElementById('sw-modal-secondary-btn');
  const secondaryLabel = document.getElementById('sw-modal-secondary-label');
  if (primaryBtn && primaryLabel) {
    if (running) {
      primaryBtn.className = 'sw-circle-btn primary-circle stop-state';
      primaryLabel.textContent = isTimer ? 'Pause' : 'Stop';
    } else {
      primaryBtn.className = 'sw-circle-btn primary-circle start-state';
      primaryLabel.textContent = isPaused ? 'Resume' : 'Start';
    }
  }
  if (secondaryBtn && secondaryLabel) {
    if (isTimer) {
      secondaryLabel.textContent = running ? '+15s' : 'Reset';
      secondaryBtn.disabled = !running && CountdownTimerState.remainingMs === CountdownTimerState.durationMs;
    } else {
      if (running) {
        secondaryLabel.textContent = 'Lap';
        secondaryBtn.disabled = false;
      } else {
        secondaryLabel.textContent = 'Reset';
        secondaryBtn.disabled = (StopwatchState.elapsed === 0 && StopwatchState.laps.length === 0);
      }
    }
  }

  renderStopwatchLaps();
}

function renderStopwatchLaps() {
  const modalLapsList = document.getElementById('sw-modal-laps-list');
  const inlineLapsBox = document.getElementById('inline-sw-laps-box');
  const inlineLapsList = document.getElementById('inline-sw-laps-list');

  const laps = StopwatchState.laps;
  if (!laps || laps.length === 0 || StopwatchState.activeToolMode === 'timer') {
    if (modalLapsList && (!laps || laps.length === 0)) {
      modalLapsList.innerHTML = '<div class="sw-laps-empty">No laps recorded yet. Tap <strong>Lap</strong> while running to mark splits.</div>';
    }
    if (inlineLapsBox) inlineLapsBox.classList.add('hidden');
    return;
  }

  // Find min and max lap times for badges
  let minTime = Infinity;
  let maxTime = -Infinity;
  if (laps.length >= 2) {
    laps.forEach(l => {
      if (l.lapTime < minTime) minTime = l.lapTime;
      if (l.lapTime > maxTime) maxTime = l.lapTime;
    });
  }

  const lapsHtml = laps.map(l => {
    const isFastest = laps.length >= 2 && l.lapTime === minTime;
    const isSlowest = laps.length >= 2 && l.lapTime === maxTime;
    const badge = isFastest 
      ? '<span class="sw-lap-badge fastest">Fastest</span>' 
      : (isSlowest ? '<span class="sw-lap-badge slowest">Slowest</span>' : '');
    const lapFormatted = formatStopwatchTime(l.lapTime).full;
    const splitFormatted = formatStopwatchTime(l.splitTime).full;

    return `
      <div class="sw-lap-row ${isFastest ? 'fastest-row' : ''} ${isSlowest ? 'slowest-row' : ''}">
        <span class="sw-lap-num">Lap ${l.num} ${badge}</span>
        <span class="sw-lap-duration mono">+${lapFormatted}</span>
        <span class="sw-lap-split mono">${splitFormatted}</span>
      </div>
    `;
  }).join('');

  if (modalLapsList) modalLapsList.innerHTML = lapsHtml;

  if (inlineLapsBox && inlineLapsList) {
    inlineLapsBox.classList.remove('hidden');
    inlineLapsList.innerHTML = lapsHtml;
  }
}

function openStopwatchModal(mode) {
  StopwatchState.minimizedDismissed = false;
  if (mode === 'timer' || mode === 'stopwatch') {
    switchClockToolMode(mode);
  }
  openModal('modal-stopwatch');
  renderStopwatchUI();
  const pillEl = document.getElementById('floating-stopwatch-pill');
  if (pillEl) pillEl.classList.add('hidden');
}

function closeStopwatchModal() {
  closeModal('modal-stopwatch');
  renderStopwatchUI();
}

function dockStopwatch() {
  closeModal('modal-stopwatch');
  StopwatchState.minimizedDismissed = false;
  renderStopwatchUI();
  showToast('\u23F1\uFE0F Clock docked to floating pill');
}

function closeFloatingStopwatchPill() {
  StopwatchState.minimizedDismissed = true;
  const pillEl = document.getElementById('floating-stopwatch-pill');
  if (pillEl) pillEl.classList.add('hidden');
}

// Window exports for HTML attributes
window.openStopwatchModal = openStopwatchModal;
window.closeStopwatchModal = closeStopwatchModal;
window.dockStopwatch = dockStopwatch;
window.switchClockToolMode = switchClockToolMode;
window.toggleStopwatch = toggleStopwatch;
window.resetStopwatch = resetStopwatch;
window.recordStopwatchLap = recordStopwatchLap;
window.toggleActiveClockTool = toggleActiveClockTool;
window.resetActiveClockTool = resetActiveClockTool;
window.secondaryActiveClockAction = secondaryActiveClockAction;
window.setCountdownTimerDuration = setCountdownTimerDuration;
window.applyCustomTimerInputs = applyCustomTimerInputs;
window.adjustCountdownTimer = adjustCountdownTimer;
window.handleStopwatchSecondaryAction = handleStopwatchSecondaryAction;
window.clearStopwatchLaps = clearStopwatchLaps;
window.setStopwatchTarget = setStopwatchTarget;
window.toggleRestStopwatchMode = toggleRestStopwatchMode;
window.closeFloatingStopwatchPill = closeFloatingStopwatchPill;

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && restTimerInterval) tickRestTimer();
  if (!document.hidden && StopwatchState.running) tickStopwatch();
  if (!document.hidden && CountdownTimerState.running) tickCountdownTimer();
  if (!document.hidden) scrollTick();
});

// --- Tab Switching Navigation ---
let activeRanksSubTab = 'ranks';
let currentActiveTab = 'workout';
const SWIPE_TAB_ORDER = ['instagram', 'focus', 'workout', 'history', 'ranks', 'settings'];

function renderInstagramTab() {
  ensureScrollState();
  const s = AppState.scroll;
  const mount = document.getElementById('dedicated-ig-mount');
  const lockout = document.getElementById('dedicated-ig-lockout');
  const timerDigits = document.getElementById('d-ig-timer-digits');

  const hasActiveSession = Boolean(s.sessionEndsAt && Date.now() < s.sessionEndsAt);
  const hasBankedTime = (s.balance > 0);

  // If no banked time and no active session, show the lockout immediately
  if (!hasActiveSession && !hasBankedTime) {
    if (lockout) lockout.classList.remove('hidden');
    if (mount) mount.innerHTML = '';
    if (timerDigits) timerDigits.textContent = '00:00';
    return;
  }

  // If banked time is present and no active session was ticking, activate it
  if (!hasActiveSession && hasBankedTime) {
    const durationMs = s.balance * 1000;
    s.sessionEndsAt = Date.now() + durationMs;
    igSessionStartDurationMs = durationMs;
    s.balance = 0;
    s.antiScrollActive = true;
    saveState();
    renderScroll();
    syncScrollToServer();
    requestNotifyPermission();
  }

  if (lockout) lockout.classList.add('hidden');

  // Mount strictly contained iframe if not already mounted
  if (mount && !document.getElementById('dedicated-ig-iframe')) {
    mount.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.id = 'dedicated-ig-iframe';
    iframe.className = 'dedicated-ig-iframe';
    iframe.src = 'https://www.instagram.com/direct/inbox/';
    // Strictly contained: NO popups, NO new windows escaping sandbox
    iframe.allow = 'camera; microphone; fullscreen; clipboard-read; clipboard-write; autoplay';
    iframe.sandbox = 'allow-same-origin allow-scripts allow-forms allow-modals';
    mount.appendChild(iframe);
  }

  startIgCountdownTicker();
}
window.renderInstagramTab = renderInstagramTab;

window.switchTab = function(tabName, slideDirection = null) {
  let targetTab = tabName;
  if (tabName === 'routines') {
    targetTab = 'workout';
  } else if (tabName === 'prs') {
    targetTab = 'ranks';
  }

  currentActiveTab = targetTab;

  const tabs = document.querySelectorAll('.nav-tab');
  const views = document.querySelectorAll('.tab-view');

  tabs.forEach(tab => {
    if (tab.dataset.tab === targetTab) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  views.forEach(view => {
    view.classList.remove('sliding-left', 'sliding-right');
    if (view.id === `view-${targetTab}`) {
      view.classList.add('active');
      if (slideDirection) {
        view.classList.add(`sliding-${slideDirection}`);
        setTimeout(() => view.classList.remove(`sliding-${slideDirection}`), 280);
      }
    } else {
      view.classList.remove('active');
    }
  });

  // Floating active workout banner management
  const banner = document.getElementById('floating-active-banner');
  if (banner) {
    if (AppState.activeWorkout && targetTab !== 'workout') {
      banner.classList.remove('hidden');
      const nameEl = document.getElementById('banner-workout-name');
      if (nameEl) nameEl.textContent = AppState.activeWorkout.title || 'Workout Session';
    } else {
      banner.classList.add('hidden');
    }
  }

  // Refresh tab content when selected
  if (targetTab === 'workout') {
    renderActiveWorkout();
    renderRoutines();
    updateOverviewStats();
  }
  if (targetTab === 'instagram') renderInstagramTab();
  if (targetTab === 'focus') renderScroll();
  if (targetTab === 'history') renderHistory();
  if (targetTab === 'ranks') {
    if (tabName === 'prs') {
      switchRanksSubTab('prs');
    } else {
      if (activeRanksSubTab === 'prs') {
        renderPRs();
      } else {
        renderRanks();
      }
    }
  }

  updateAntiScrollUI();

  window.scrollTo(0, 0);
};

window.switchRanksSubTab = function(subTab) {
  activeRanksSubTab = subTab;
  const ranksContent = document.getElementById('subview-ranks-content');
  const prsContent = document.getElementById('subview-prs-content');
  const lbContent = document.getElementById('subview-leaderboard-content');
  const btnRanks = document.getElementById('btn-subtab-ranks');
  const btnPrs = document.getElementById('btn-subtab-prs');
  const btnLb = document.getElementById('btn-subtab-leaderboard');

  if (subTab === 'leaderboard') {
    if (ranksContent) ranksContent.classList.add('hidden');
    if (prsContent) prsContent.classList.add('hidden');
    if (lbContent) lbContent.classList.remove('hidden');
    if (btnRanks) btnRanks.classList.remove('active');
    if (btnPrs) btnPrs.classList.remove('active');
    if (btnLb) btnLb.classList.add('active');
    if (window.AuthSystem && typeof window.AuthSystem.updateLeaderboardViews === 'function') {
      window.AuthSystem.updateLeaderboardViews();
    }
  } else if (subTab === 'prs') {
    if (ranksContent) ranksContent.classList.add('hidden');
    if (prsContent) prsContent.classList.remove('hidden');
    if (lbContent) lbContent.classList.add('hidden');
    if (btnRanks) btnRanks.classList.remove('active');
    if (btnPrs) btnPrs.classList.add('active');
    if (btnLb) btnLb.classList.remove('active');
    renderPRs();
  } else {
    if (ranksContent) ranksContent.classList.remove('hidden');
    if (prsContent) prsContent.classList.add('hidden');
    if (lbContent) lbContent.classList.add('hidden');
    if (btnRanks) btnRanks.classList.add('active');
    if (btnPrs) btnPrs.classList.remove('active');
    if (btnLb) btnLb.classList.remove('active');
    renderRanks();
  }
  triggerHaptic([30]);
};

window.toggleActiveWorkoutRoutinesPeek = function() {
  const drawer = document.getElementById('active-routines-peek-drawer');
  if (!drawer) return;
  const isHidden = drawer.classList.contains('hidden');
  if (isHidden) {
    drawer.classList.remove('hidden');
    renderActivePeekRoutines();
  } else {
    drawer.classList.add('hidden');
  }
  triggerHaptic([30]);
};

function renderActivePeekRoutines() {
  const container = document.getElementById('active-peek-routines-grid');
  if (!container) return;
  const defaultIdSet = new Set(DEFAULT_ROUTINES.map(d => d.id));
  const customRoutines = (AppState.routines || []).filter(r => !r.isFeatured && !defaultIdSet.has(r.id));
  if (customRoutines.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted); font-size:0.8rem; padding:8px;">No custom routines saved yet.</p>`;
    return;
  }
  container.innerHTML = customRoutines.map(r => `
    <div class="peek-routine-row" style="display:flex; justify-content:space-between; align-items:center; padding:8px 10px; background:rgba(255,255,255,0.03); border-radius:10px; margin-bottom:6px;">
      <div>
        <strong style="font-size:0.85rem; color:var(--text-main);">${escapeHtml(r.name)}</strong>
        <span style="font-size:0.72rem; color:var(--text-muted); display:block;">${r.exerciseIds.length} exercises</span>
      </div>
      <button type="button" class="small-btn secondary-btn" onclick="addExercisesFromRoutineToActive('${r.id}')">+ Add to Session</button>
    </div>
  `).join('');
}

window.addExercisesFromRoutineToActive = function(routineId) {
  const routine = (AppState.routines || []).find(r => r.id === routineId);
  if (!routine || !AppState.activeWorkout) return;
  routine.exerciseIds.forEach(exId => {
    const ex = AppState.exercises.find(e => e.id === exId);
    if (!ex) return;
    const pr = AppState.prs[ex.name];
    AppState.activeWorkout.exercises.push({
      exerciseId: ex.id,
      notes: '',
      sets: [
        { type: 'N', weight: pr ? pr.weight : 40, reps: pr ? pr.reps : 10, completed: false, rpe: 8 }
      ]
    });
  });
  saveState();
  renderActiveWorkout();
  const drawer = document.getElementById('active-routines-peek-drawer');
  if (drawer) drawer.classList.add('hidden');
  showToast(`Added exercises from "${routine.name}"`);
  triggerHaptic([40, 50]);
};

window.openCreateRoutineWithFeatured = function() {
  openModal('modal-create-routine');
  if (typeof switchCreateRoutineTab === 'function') {
    switchCreateRoutineTab('featured');
  }
};

// --- Routines Management ---
let routineCategoryFilter = 'all';

window.setRoutineFilter = function(filter) {
  routineCategoryFilter = filter;
  document.querySelectorAll('#routine-filter-chips .chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.filter === filter);
  });
  renderRoutines();
  triggerHaptic([30]);
};

window.deleteRoutine = function(routineId, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  const routine = (AppState.routines || []).find(r => r.id === routineId);
  if (!routine) return;

  const routineName = routine.name || 'this routine';
  if (!confirm(`Are you sure you want to delete "${routineName}"?`)) {
    return;
  }

  // Record into deletedRoutineIds to prevent auto-sync resurrection
  AppState.deletedRoutineIds = AppState.deletedRoutineIds || [];
  if (!AppState.deletedRoutineIds.includes(routineId)) {
    AppState.deletedRoutineIds.push(routineId);
  }

  // Remove from state.routines
  AppState.routines = AppState.routines.filter(r => r.id !== routineId);
  saveState();
  renderRoutines();
  triggerHaptic([40, 50]);
  showToast(`Deleted "${routineName}"`);
};

window.restoreDefaultRoutines = function() {
  showToast('Featured workouts are in + New Routine -> Featured Templates.');
};

function renderRoutines() {
  const container = document.getElementById('routines-grid');
  if (!container) return;

  const defaultIdSet = new Set(DEFAULT_ROUTINES.map(d => d.id));
  const allRoutines = AppState.routines || [];

  // Saved Routines strictly contains user's custom created/saved routines
  const customRoutines = allRoutines.filter(r => !r.isFeatured && !defaultIdSet.has(r.id));

  if (customRoutines.length === 0) {
    container.innerHTML = `
      <div class="idle-placeholder" style="grid-column: 1 / -1; padding: 32px 16px; text-align: center;">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">📋</div>
        <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 6px;">No Custom Routines Saved</h3>
        <p style="color: var(--text-muted); font-size: 0.82rem; max-width: 320px; margin: 0 auto 16px;">
          Build your own custom split or load one from our recommended featured workouts.
        </p>
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
          <button type="button" class="primary-glow-btn small-btn" onclick="openModal('modal-create-routine')">+ New Routine</button>
          <button type="button" class="secondary-btn small-btn" onclick="openCreateRoutineWithFeatured()">★ Featured Templates</button>
        </div>
      </div>
    `;
    updateOverviewStats();
    return;
  }

  container.innerHTML = customRoutines.map(routine => {
    // Resolve exercises
    const exNames = routine.exerciseIds
      .map(id => {
        const found = AppState.exercises.find(e => e.id === id);
        return found ? found.name : '';
      })
      .filter(Boolean);

    return `
      <div class="routine-card" data-routine-id="${routine.id}">
        <div class="routine-card-header">
          <div class="routine-header-info">
            <div class="routine-title-row">
              <h3 class="routine-card-title">${escapeHtml(routine.name)}</h3>
            </div>
            <div class="routine-tags-row">
              <span class="routine-tag-pill">${escapeHtml(routine.tag || 'Workout')}</span>
            </div>
          </div>
          <div class="routine-card-actions">
            <button type="button" class="routine-delete-btn" onclick="deleteRoutine('${routine.id}', event)" title="Delete Routine" aria-label="Delete routine ${escapeHtml(routine.name)}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
            <button class="start-routine-btn" onclick="startWorkoutFromRoutine('${routine.id}')">Start &rarr;</button>
          </div>
        </div>
        <p class="routine-exercises-preview">${escapeHtml(exNames.join(' • '))}</p>
        <div class="routine-card-footer">
          <span class="routine-meta-info">${routine.exerciseIds.length} Exercises</span>
          <span class="routine-meta-info">Estimated 45m</span>
        </div>
      </div>
    `;
  }).join('');

  // If some default routines have been deleted, render a subtle restore option at bottom
  if (AppState.deletedRoutineIds && AppState.deletedRoutineIds.length > 0) {
    const restoreRow = document.createElement('div');
    restoreRow.className = 'routines-restore-footer';
    restoreRow.innerHTML = `
      <button type="button" class="restore-defaults-btn" onclick="restoreDefaultRoutines()">
        <span>&#9218; Restore ${AppState.deletedRoutineIds.length} deleted default routine(s)</span>
      </button>
    `;
    container.appendChild(restoreRow);
  }

  // Update hero stats overview
  updateOverviewStats();
}

// --- Cosmic Streak Progression Logic & Roadmap ---
const ASTEROID_STATIONS = [
  { index: 0, id: 'celestial-node-0', name: 'Earth Launchpad', sub: 'Day 0 Streak • Home Planet', type: 'earth' },
  { index: 1, id: 'celestial-node-1', name: 'Ruby Igniter', sub: 'Asteroid 1 • Day 1 Streak', type: 'asteroid' },
  { index: 2, id: 'celestial-node-2', name: 'Amber Thruster', sub: 'Asteroid 2 • Day 2 Streak', type: 'asteroid' },
  { index: 3, id: 'celestial-node-3', name: 'Golden Sling', sub: 'Asteroid 3 • Day 3 Streak', type: 'asteroid' },
  { index: 4, id: 'celestial-node-4', name: 'Emerald Belt', sub: 'Asteroid 4 • Day 4 Streak', type: 'asteroid' },
  { index: 5, id: 'celestial-node-5', name: 'Cyan Comet', sub: 'Asteroid 5 • Day 5 Streak', type: 'asteroid' },
  { index: 6, id: 'celestial-node-6', name: 'Cobalt Void', sub: 'Asteroid 6 • Day 6 Streak', type: 'asteroid' },
  { index: 7, id: 'celestial-node-7', name: 'Nebula Crown', sub: 'Asteroid 7 • 1-Week Milestone', type: 'asteroid' },
  { index: 8, id: 'celestial-node-8', name: 'Rose Valkyrie', sub: 'Asteroid 8 • Day 8 Streak', type: 'asteroid' },
  { index: 9, id: 'celestial-node-9', name: 'Chrome Sentinel', sub: 'Asteroid 9 • Day 9 Streak', type: 'asteroid' },
  { index: 10, id: 'celestial-node-10', name: 'Maroon Moon Citadel', sub: 'Day 10+ • Lunar Sovereign', type: 'moon' }
];

function getConsecutiveWorkoutStreak() {
  if (typeof AppState.streak === 'number' && AppState.streak >= 0) {
    return AppState.streak;
  }
  const history = AppState.history || [];
  if (!history.length) return 0;

  // Extract unique sorted calendar date strings (YYYY-MM-DD)
  const uniqueDates = Array.from(new Set(
    history
      .map(h => {
        try {
          const d = new Date(h.date);
          return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean)
  )).sort().reverse();

  if (!uniqueDates.length) return 0;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const mostRecent = uniqueDates[0];
  // If most recent is today or yesterday, streak is currently alive
  let streak = 0;
  if (mostRecent === today || mostRecent === yesterday) {
    let expectedDate = new Date(mostRecent);
    for (const dateStr of uniqueDates) {
      const curDate = new Date(dateStr);
      const diffDays = Math.round((expectedDate.getTime() - curDate.getTime()) / 86400000);
      if (diffDays === 0) {
        streak++;
        expectedDate = new Date(curDate.getTime() - 86400000);
      } else {
        break;
      }
    }
  } else {
    // If not worked out today or yesterday, consecutive streak is 0
    streak = 0;
  }

  return streak;
}
window.getConsecutiveWorkoutStreak = getConsecutiveWorkoutStreak;

function renderStreakProgressionMap() {
  const streak = getConsecutiveWorkoutStreak();
  const streakNumEl = document.getElementById('cosmic-streak-num');
  const distanceTextEl = document.getElementById('cosmic-distance-text');
  
  if (streakNumEl) streakNumEl.textContent = streak;

  // Current station index: 0 = Earth, 1-9 = Asteroids, 10 = Moon Citadel
  const activeStationIdx = Math.min(Math.max(streak, 0), 10);

  if (distanceTextEl) {
    if (activeStationIdx >= 10) {
      distanceTextEl.innerHTML = `<strong>🌕 Moon Landed!</strong> Day ${streak} Streak &bull; Lunar Conqueror Station`;
    } else {
      const remaining = 10 - activeStationIdx;
      distanceTextEl.innerHTML = `<strong>${remaining} Day${remaining === 1 ? '' : 's'} Remaining</strong> to Moon Landing (Station ${activeStationIdx}/10)`;
    }
  }

  // Remove existing rocket indicator from DOM before attaching to current station
  const existingRocket = document.querySelector('.cosmic-rocket-indicator');
  if (existingRocket) {
    existingRocket.remove();
  }

  // Update styles for each celestial node
  ASTEROID_STATIONS.forEach(station => {
    const nodeEl = document.getElementById(station.id);
    if (!nodeEl) return;

    nodeEl.classList.remove('active-station', 'visited-station', 'locked-station');

    if (station.index === activeStationIdx) {
      nodeEl.classList.add('active-station');

      // Append rocket indicator
      const rocket = document.createElement('div');
      rocket.className = 'cosmic-rocket-indicator';
      const label = station.index === 0 ? 'START' : (station.index === 10 ? 'LANDED' : `DAY ${streak}`);
      rocket.innerHTML = `
        <span class="rocket-ship-emoji">🚀</span>
        <span class="rocket-badge-tag">${label}</span>
      `;
      nodeEl.appendChild(rocket);
    } else if (station.index < activeStationIdx) {
      nodeEl.classList.add('visited-station');
    } else {
      nodeEl.classList.add('locked-station');
    }
  });
}
window.renderStreakProgressionMap = renderStreakProgressionMap;

function setDemoStreak(num) {
  AppState.streak = Number(num);
  saveState();
  updateOverviewStats();
  showToast(`🚀 Workout streak set to ${num} day${num === 1 ? '' : 's'}!`);
}
window.setDemoStreak = setDemoStreak;

function inspectAsteroidNode(index) {
  const station = ASTEROID_STATIONS.find(s => s.index === index);
  if (!station) return;
  const currentStreak = getConsecutiveWorkoutStreak();
  if (index === 0) {
    showToast(`🌍 Earth Launchpad: Starting base. Current consecutive streak: ${currentStreak} days.`);
  } else if (index === 10) {
    showToast(`🌑 Maroon Moon Citadel: Final destination (10+ day streak). Current position: ${currentStreak >= 10 ? 'Landed!' : `${10 - currentStreak} days to go`}`);
  } else {
    showToast(`☄️ ${station.name}: Streak Day ${index}. Keep training consecutively to advance!`);
  }
}
window.inspectAsteroidNode = inspectAsteroidNode;

function updateOverviewStats() {
  const streakEl = document.getElementById('stat-streak');
  const countEl = document.getElementById('stat-weekly-count');
  const volEl = document.getElementById('stat-total-volume');
  const volUnitEl = document.getElementById('stat-volume-unit');

  // Compute streak
  const streak = getConsecutiveWorkoutStreak();
  if (streakEl) streakEl.textContent = streak;

  // This week count
  const history = AppState.history || [];
  const oneWeekAgo = Date.now() - 7 * 86400000;
  const thisWeekWorkouts = history.filter(h => new Date(h.date).getTime() > oneWeekAgo);
  if (countEl) countEl.textContent = thisWeekWorkouts.length;

  // Total volume
  let totalVol = 0;
  history.forEach(h => totalVol += (h.volume || 0));
  if (volEl) volEl.textContent = Math.round(totalVol).toLocaleString();
  if (volUnitEl) volUnitEl.textContent = `TOTAL ${AppState.settings.unit.toUpperCase()} ⚡`;

  // Update Cosmic Progression Map
  renderStreakProgressionMap();
}

// --- Starting a Workout ---
window.startBlankWorkout = function() {
  if (AppState.activeWorkout) {
    if (!confirm('A workout is already running. Would you like to abandon it and start a new one?')) {
      switchTab('workout');
      return;
    }
  }

  AppState.activeWorkout = {
    id: 'wo_' + Date.now(),
    title: 'Workout Session',
    startTime: Date.now(),
    exercises: []
  };

  saveState();
  startWorkoutTimer();
  switchTab('workout');
  triggerHaptic([50]);
};

window.startWorkoutFromRoutine = function(routineId) {
  const routine = AppState.routines.find(r => r.id === routineId);
  if (!routine) return;

  if (AppState.activeWorkout) {
    if (!confirm('A workout is already in progress. Discard it and load this routine?')) {
      switchTab('workout');
      return;
    }
  }

  const loadedExercises = routine.exerciseIds.map(exId => {
    const ex = AppState.exercises.find(e => e.id === exId);
    if (!ex) return null;

    // Get previous record
    const pr = AppState.prs[ex.name];
    const prevWeight = pr ? pr.weight : 40;
    const prevReps = pr ? pr.reps : 10;

    return {
      exerciseId: ex.id,
      name: ex.name,
      category: ex.category,
      sets: [
        { weight: prevWeight, reps: prevReps, completed: false },
        { weight: prevWeight, reps: prevReps, completed: false },
        { weight: prevWeight, reps: prevReps, completed: false }
      ]
    };
  }).filter(Boolean);

  AppState.activeWorkout = {
    id: 'wo_' + Date.now(),
    title: routine.name,
    startTime: Date.now(),
    exercises: loadedExercises
  };

  saveState();
  startWorkoutTimer();
  switchTab('workout');
  triggerHaptic([50]);
};

// --- Render Active Workout ---
function renderActiveWorkout() {
  const idleState = document.getElementById('workout-idle-state');
  const activeState = document.getElementById('workout-active-state');
  const dot = document.getElementById('tab-active-dot');

  if (!AppState.activeWorkout) {
    if (idleState) idleState.classList.remove('hidden');
    if (activeState) activeState.classList.add('hidden');
    if (dot) dot.classList.add('hidden');
    renderRoutines();
    updateOverviewStats();
    return;
  }

  if (idleState) idleState.classList.add('hidden');
  if (activeState) activeState.classList.remove('hidden');
  if (dot) dot.classList.remove('hidden');

  const restSel = document.getElementById('active-rest-select');
  if (restSel) restSel.value = String(AppState.activeWorkout.restSeconds || AppState.settings.defaultRest || 90);

  // Title input
  const titleInput = document.getElementById('active-workout-name');
  if (titleInput && titleInput.value !== AppState.activeWorkout.title) {
    titleInput.value = AppState.activeWorkout.title;
  }

  // Calculate live volume and sets
  let totalVolume = 0;
  let totalSets = 0;

  AppState.activeWorkout.exercises.forEach(ex => {
    ex.sets.forEach(set => {
      if (set.completed) {
        totalVolume += (Number(set.weight) || 0) * (Number(set.reps) || 0);
        totalSets++;
      }
    });
  });

  document.getElementById('active-volume-display').textContent = `${Math.round(totalVolume)} ${AppState.settings.unit}`;
  document.getElementById('active-sets-display').textContent = totalSets;

  // Render Exercise Cards
  const listEl = document.getElementById('active-exercises-list');
  if (!listEl) return;

  listEl.innerHTML = AppState.activeWorkout.exercises.map((ex, exIndex) => {
    const pr = AppState.prs[ex.name];
    const prevText = pr ? `${pr.weight} ${AppState.settings.unit} × ${pr.reps}` : '-';

    return `
      <div class="exercise-session-card" data-ex-index="${exIndex}">
        <div class="exercise-session-header">
          <div class="ex-title-group">
            <span class="ex-session-name">${escapeHtml(ex.name)}</span>
            <span class="ex-session-cat">${escapeHtml(ex.category)}${scrollHint(ex.name)}</span>
          </div>
          <button class="remove-ex-btn" onclick="removeExerciseFromActive(${exIndex})" title="Remove Exercise">&times;</button>
        </div>

        <div class="sets-table">
          <div class="sets-header-row">
            <span>SET</span>
            <span>PREV</span>
            <span>${AppState.settings.unit.toUpperCase()}</span>
            <span>REPS</span>
            <span>DONE</span>
            <span>DEL</span>
          </div>

          ${(() => {
            let workingCount = 0;
            let warmupCount = 0;
            return ex.sets.map((set, setIndex) => {
              let badgeHtml;
              if (set.isWarmup) {
                warmupCount++;
                badgeHtml = `<span class="set-index-badge warmup-badge" title="Warm-up Set">W${warmupCount}</span>`;
              } else {
                workingCount++;
                badgeHtml = `<span class="set-index-badge">${workingCount}</span>`;
              }

              return `
                <div class="set-row ${set.completed ? 'completed' : ''} ${set.isWarmup ? 'warmup-set-row' : ''}" data-set-index="${setIndex}">
                  ${badgeHtml}
                  <span class="prev-set-text">${prevText}</span>
                  <input type="number" class="set-input set-weight-input" 
                         value="${set.weight}" 
                         placeholder="0" 
                         step="0.5" 
                         onchange="updateActiveSet(${exIndex}, ${setIndex}, 'weight', this.value)">
                  <input type="number" class="set-input set-reps-input" 
                         value="${set.reps}" 
                         placeholder="0" 
                         onchange="updateActiveSet(${exIndex}, ${setIndex}, 'reps', this.value)">
                  <button class="set-checkbox-btn ${set.completed ? 'checked' : ''}" 
                          onclick="toggleSetComplete(${exIndex}, ${setIndex})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </button>
                  <button type="button" class="delete-set-btn" 
                          onclick="deleteSetFromActiveExercise(${exIndex}, ${setIndex})" 
                          title="Delete this set (drop down to 2 sets)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              `;
            }).join('');
          })()}

          <div class="sets-action-buttons-row">
            <button type="button" class="add-set-btn" onclick="addSetToActiveExercise(${exIndex})">+ Working Set</button>
            <button type="button" class="add-warmup-btn" onclick="addWarmupSetToActiveExercise(${exIndex})">+ Warm-up Set</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Active Set Operations
window.updateActiveSet = function(exIndex, setIndex, field, value) {
  if (!AppState.activeWorkout) return;
  const set = AppState.activeWorkout.exercises[exIndex].sets[setIndex];
  if (set) {
    set[field] = Number(value) || 0;
    if (field === 'reps' && set.completed) {
      const nc = calcScrollCredit(AppState.activeWorkout.exercises[exIndex].name, set.reps);
      const diff = nc - (set.credit || 0);
      if (diff !== 0) addScrollCredit(diff);
      set.credit = nc;
    }
    saveState();
    renderActiveWorkout();
  }
};

window.toggleSetComplete = function(exIndex, setIndex) {
  if (!AppState.activeWorkout) return;
  const set = AppState.activeWorkout.exercises[exIndex].sets[setIndex];
  if (!set) return;

  set.completed = !set.completed;
  const exName = AppState.activeWorkout.exercises[exIndex].name;
  if (set.completed) {
    const credit = calcScrollCredit(exName, set.reps);
    set.credit = credit;
    if (credit > 0) addScrollCredit(credit, exName);
  } else if (set.credit) {
    addScrollCredit(-set.credit);
    set.credit = 0;
  }
  saveState();

  if (set.completed) {
    playSetCompletePing();
    triggerHaptic([40, 30, 70]);
    // Start rest timer
    requestNotifyPermission();
    triggerRestTimer(AppState.activeWorkout.restSeconds || AppState.settings.defaultRest);
  }

  renderActiveWorkout();
};

window.deleteSetFromActiveExercise = function(exIndex, setIndex) {
  if (!AppState.activeWorkout) return;
  const ex = AppState.activeWorkout.exercises[exIndex];
  if (!ex || !ex.sets) return;
  if (ex.sets.length <= 1) {
    if (!confirm('This is the only set for this exercise. Remove set?')) return;
  }
  ex.sets.splice(setIndex, 1);
  saveState();
  renderActiveWorkout();
  triggerHaptic([25]);
  showToast('Set removed');
};

window.addWarmupSetToActiveExercise = function(exIndex) {
  if (!AppState.activeWorkout) return;
  const ex = AppState.activeWorkout.exercises[exIndex];
  if (!ex) return;
  // Calculate sensible warmup weight (approx 40-50% of first working set or 20kg)
  const baseWeight = (ex.sets && ex.sets[0]) ? Number(ex.sets[0].weight) : 50;
  const warmupWeight = Math.max(10, Math.round((baseWeight * 0.5) / 2.5) * 2.5);
  const warmupReps = 12;

  // Insert before first working set so warm-ups come first in sequence
  let insertIdx = 0;
  while (insertIdx < ex.sets.length && ex.sets[insertIdx].isWarmup) {
    insertIdx++;
  }
  ex.sets.splice(insertIdx, 0, {
    weight: warmupWeight,
    reps: warmupReps,
    completed: false,
    isWarmup: true
  });
  saveState();
  renderActiveWorkout();
  triggerHaptic([30]);
  showToast('🔥 Warm-up set added');
};

window.addSetToActiveExercise = function(exIndex) {
  if (!AppState.activeWorkout) return;
  const ex = AppState.activeWorkout.exercises[exIndex];
  const workingSets = ex.sets.filter(s => !s.isWarmup);
  const lastSet = workingSets.length ? workingSets[workingSets.length - 1] : ex.sets[ex.sets.length - 1];
  const newWeight = lastSet ? lastSet.weight : 50;
  const newReps = lastSet ? lastSet.reps : 10;

  ex.sets.push({ weight: newWeight, reps: newReps, completed: false, isWarmup: false });
  saveState();
  renderActiveWorkout();
  triggerHaptic([30]);
};

window.removeExerciseFromActive = function(exIndex) {
  if (!AppState.activeWorkout) return;
  if (confirm('Remove this exercise from current workout?')) {
    AppState.activeWorkout.exercises.splice(exIndex, 1);
    saveState();
    renderActiveWorkout();
  }
};

// --- Finish Workout & Record Calculation ---
window.finishActiveWorkout = function() {
  if (!AppState.activeWorkout) return;

  const workout = AppState.activeWorkout;
  const durationSecs = Math.max(1, Math.floor((Date.now() - workout.startTime) / 1000));
  
  let totalVolume = 0;
  let setsCount = 0;
  const recordedExercises = [];
  const newPRsEarned = [];

  workout.exercises.forEach(ex => {
    let bestWeight = 0;
    let bestReps = 0;
    let completedSetsCount = 0;

    ex.sets.forEach(set => {
      if (set.completed) {
        completedSetsCount++;
        setsCount++;
        const w = Number(set.weight) || 0;
        const r = Number(set.reps) || 0;
        totalVolume += w * r;

        if (!set.isWarmup && w > bestWeight) {
          bestWeight = w;
          bestReps = r;
        } else if (bestWeight === 0 && w > bestWeight) {
          bestWeight = w;
          bestReps = r;
        }
      }
    });

    if (completedSetsCount > 0) {
      recordedExercises.push({
        name: ex.name,
        sets: completedSetsCount,
        bestWeight: bestWeight,
        bestReps: bestReps
      });

      // Check for PR
      const currentPR = AppState.prs[ex.name];
      if (!currentPR || bestWeight > currentPR.weight) {
        AppState.prs[ex.name] = {
          weight: bestWeight,
          reps: bestReps,
          date: new Date().toISOString()
        };
        newPRsEarned.push({
          name: ex.name,
          weight: bestWeight,
          oldWeight: currentPR ? currentPR.weight : 0
        });
      }
    }
  });

  if (setsCount === 0) {
    if (!confirm('No completed sets were logged. Finish and discard?')) {
      return;
    }
    AppState.activeWorkout = null;
    saveState();
    closeRestTimer();
    renderActiveWorkout();
    return;
  }

  // Create history entry
  const historyItem = {
    id: 'hist_' + Date.now(),
    title: workout.title || 'Workout Session',
    date: new Date().toISOString(),
    durationSeconds: durationSecs,
    volume: Math.round(totalVolume),
    unit: AppState.settings.unit,
    setsCount: setsCount,
    exercises: recordedExercises
  };

  const ranksBefore = getRankSnapshot();
  AppState.history.unshift(historyItem);
  AppState.activeWorkout = null;
  saveState();
  closeRestTimer();
  updateOverviewStats();

  // Show celebration modal
  showCelebrationModal(historyItem, newPRsEarned);
  setTimeout(() => announceRankUps(ranksBefore), 600);
};

window.cancelActiveWorkout = function() {
  if (confirm('Are you sure you want to discard this entire workout?')) {
    AppState.activeWorkout = null;
    saveState();
    closeRestTimer();
    renderActiveWorkout();
  }
};

function showCelebrationModal(workout, newPRs) {
  document.getElementById('c-time').textContent = formatDuration(workout.durationSeconds);
  document.getElementById('c-volume').textContent = `${workout.volume} ${workout.unit}`;
  document.getElementById('c-sets').textContent = workout.setsCount;

  const prsBox = document.getElementById('celebration-prs-box');
  const prsList = document.getElementById('c-prs-list');

  if (newPRs.length > 0) {
    prsBox.classList.remove('hidden');
    prsList.innerHTML = newPRs.map(pr => `
      <div><strong>${escapeHtml(pr.name)}:</strong> ${pr.weight} ${AppState.settings.unit} (Previous: ${pr.oldWeight || 'None'} ${AppState.settings.unit})</div>
    `).join('');
  } else {
    prsBox.classList.add('hidden');
  }

  openModal('modal-celebration');
  triggerHaptic([100, 50, 100, 50, 200]);
}

// --- History View ---
function renderHistory() {
  const container = document.getElementById('history-list');
  if (!container) return;

  if (AppState.history.length === 0) {
    container.innerHTML = `
      <div class="idle-placeholder">
        <p>No logged workouts yet. Complete a workout to see your gains timeline!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = AppState.history.map(item => {
    const itemId = item.id || item.date;
    const dateFormatted = new Date(item.date).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return `
      <div class="history-card" data-history-id="${escapeHtml(itemId)}">
        <div class="history-card-header">
          <div>
            <h3 class="history-title">${escapeHtml(item.title)}</h3>
            <span class="history-date">${dateFormatted}</span>
          </div>
          <div class="history-actions-row">
            <button type="button" class="history-action-btn edit" onclick="openEditHistoryModal('${escapeHtml(itemId)}')" title="Edit logged workout data">
              ✏️ Edit
            </button>
            <button type="button" class="history-action-btn delete" onclick="deleteHistoryWorkout('${escapeHtml(itemId)}')" title="Delete workout history">
              🗑️ Delete
            </button>
          </div>
        </div>

        <div class="history-stats-row">
          <div class="history-stat-item">⏱️ <strong>${formatDuration(item.durationSeconds)}</strong></div>
          <div class="history-stat-item">⚡ <strong>${item.volume.toLocaleString()} ${item.unit}</strong></div>
          <div class="history-stat-item">🎯 <strong>${item.setsCount} sets</strong></div>
        </div>

        <div class="history-ex-tags">
          ${item.exercises ? item.exercises.map(ex => `
            <span class="history-tag">${escapeHtml(ex.name)} (${ex.bestWeight || 0}${item.unit} × ${ex.bestReps || 0})</span>
          `).join('') : ''}
        </div>
        ${item.notes ? `<div style="font-size:0.75rem;color:var(--text-muted);font-style:italic;margin-top:4px;">📝 ${escapeHtml(item.notes)}</div>` : ''}
      </div>
    `;
  }).join('');
}

window.deleteHistoryWorkout = function(id) {
  const item = AppState.history.find(h => (h.id === id || h.date === id));
  if (!item) return;
  if (!confirm(`Are you sure you want to delete the workout "${item.title}" logged on ${new Date(item.date).toLocaleDateString()}? This will alter your logged data and streaks.`)) {
    return;
  }
  AppState.history = AppState.history.filter(h => (h.id !== id && h.date !== id));
  saveState();
  updateOverviewStats();
  renderHistory();
  if (typeof renderPRs === 'function') renderPRs();
  showToast('🗑️ Workout history entry permanently deleted.');
  triggerHaptic([30, 40]);
};

window.openEditHistoryModal = function(id) {
  const item = AppState.history.find(h => (h.id === id || h.date === id));
  if (!item) return;

  document.getElementById('edit-history-id').value = item.id || item.date;
  document.getElementById('edit-history-title').value = item.title || 'Workout Session';
  
  // Format date for datetime-local input
  try {
    const d = new Date(item.date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    document.getElementById('edit-history-date').value = d.toISOString().slice(0, 16);
  } catch (e) {
    document.getElementById('edit-history-date').value = '';
  }

  const durationMin = Math.round((item.durationSeconds || 0) / 60) || 45;
  document.getElementById('edit-history-duration').value = durationMin;
  document.getElementById('edit-history-volume').value = item.volume || 0;
  document.getElementById('edit-history-sets').value = item.setsCount || (item.exercises ? item.exercises.reduce((a, x) => a + (x.sets || 3), 0) : 10);
  
  const exSummary = item.exercises && item.exercises.length
    ? item.exercises.map(e => `${e.name} (${e.bestWeight || 0}${item.unit} × ${e.bestReps || 0})`).join(', ')
    : '';
  document.getElementById('edit-history-notes').value = item.notes || exSummary || '';

  openModal('modal-edit-history');
};

window.saveHistoryWorkoutEdit = function(e) {
  e.preventDefault();
  const id = document.getElementById('edit-history-id').value;
  const item = AppState.history.find(h => (h.id === id || h.date === id));
  if (!item) return;

  const newTitle = document.getElementById('edit-history-title').value.trim();
  const newDate = document.getElementById('edit-history-date').value;
  const newDurationMin = Number(document.getElementById('edit-history-duration').value) || 45;
  const newVolume = Number(document.getElementById('edit-history-volume').value) || 0;
  const newSets = Number(document.getElementById('edit-history-sets').value) || 1;
  const newNotes = document.getElementById('edit-history-notes').value.trim();

  item.title = newTitle || item.title;
  if (newDate) {
    item.date = new Date(newDate).toISOString();
  }
  item.durationSeconds = newDurationMin * 60;
  item.volume = Math.round(newVolume);
  item.setsCount = newSets;
  item.notes = newNotes;

  saveState();
  updateOverviewStats();
  renderHistory();
  closeModal('modal-edit-history');
  showToast('✅ Workout history successfully updated.');
  triggerHaptic([30]);
};

// --- PRs View ---
let prCategoryFilter = 'all';

function renderPRs() {
  const container = document.getElementById('prs-grid');
  if (!container) return;

  const entries = Object.entries(AppState.prs);
  if (entries.length === 0) {
    container.innerHTML = `<div class="idle-placeholder" style="grid-column: span 2;"><p>No Personal Records logged yet. Crush some weights to unlock PR trophies!</p></div>`;
    return;
  }

  const filtered = entries.filter(([name, data]) => {
    if (prCategoryFilter === 'all') return true;
    const ex = AppState.exercises.find(e => e.name === name);
    return ex && ex.category.toLowerCase() === prCategoryFilter.toLowerCase();
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="idle-placeholder" style="grid-column: span 2;"><p>No records in this muscle category yet.</p></div>`;
    return;
  }

  container.innerHTML = filtered.map(([name, data]) => {
    const ex = AppState.exercises.find(e => e.name === name);
    const cat = ex ? ex.category : 'General';
    const dateStr = new Date(data.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

    return `
      <div class="pr-card">
        <div class="pr-card-header">
          <span class="pr-cat">${escapeHtml(cat)}</span>
          <span style="font-size: 1.1rem;">🏆</span>
        </div>
        <div class="pr-name" title="${escapeHtml(name)}">${escapeHtml(name)}</div>
        <div class="pr-value-box">
          <span class="pr-value">${data.weight}</span>
          <span class="pr-unit">${AppState.settings.unit} × ${data.reps} reps</span>
        </div>
        <span class="pr-date">${dateStr}</span>
      </div>
    `;
  }).join('');
}

// --- Exercise Picker & Search ---
let activePickerTarget = 'workout'; // 'workout' or 'routine_builder'
let pickerCategory = 'all';
let newRoutineSelectedExerciseIds = [];

function openExercisePicker(target = 'workout') {
  activePickerTarget = target;
  const bottomBar = document.getElementById('exercise-picker-bottom-bar');
  if (bottomBar) {
    bottomBar.classList.toggle('hidden', target !== 'routine_builder');
  }
  renderExercisePickerList();
  openModal('modal-add-exercise');
}

function renderExercisePickerList() {
  const container = document.getElementById('exercise-list-container');
  const searchInput = document.getElementById('exercise-search-input');
  const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

  const filtered = AppState.exercises.filter(ex => {
    const matchesCat = pickerCategory === 'all' || ex.category.toLowerCase() === pickerCategory.toLowerCase();
    const matchesQuery = !query || ex.name.toLowerCase().includes(query) || ex.category.toLowerCase().includes(query);
    return matchesCat && matchesQuery;
  });

  const isRoutine = activePickerTarget === 'routine_builder';
  const doneCount = document.getElementById('picker-done-count');
  if (doneCount) doneCount.textContent = newRoutineSelectedExerciseIds.length;

  container.innerHTML = filtered.map(ex => {
    const isSelected = isRoutine && newRoutineSelectedExerciseIds.includes(ex.id);
    return `
      <div class="ex-picker-item ${isSelected ? 'selected' : ''}" onclick="selectExercise('${ex.id}')">
        <span class="ex-picker-name">${escapeHtml(ex.name)}</span>
        <div class="ex-picker-right">
          <span class="ex-picker-cat">${escapeHtml(ex.category)}</span>
          ${isSelected ? '<span class="ex-picker-check">&#10003; Added</span>' : ''}
        </div>
      </div>
    `;
  }).join('');
}

window.selectExercise = function(exId) {
  const ex = AppState.exercises.find(e => e.id === exId);
  if (!ex) return;

  if (activePickerTarget === 'workout') {
    if (!AppState.activeWorkout) {
      startBlankWorkout();
    }
    
    // Add to active workout
    const pr = AppState.prs[ex.name];
    const prevWeight = pr ? pr.weight : 40;
    const prevReps = pr ? pr.reps : 10;

    AppState.activeWorkout.exercises.push({
      exerciseId: ex.id,
      name: ex.name,
      category: ex.category,
      sets: [
        { weight: prevWeight, reps: prevReps, completed: false },
        { weight: prevWeight, reps: prevReps, completed: false },
        { weight: prevWeight, reps: prevReps, completed: false }
      ]
    });

    saveState();
    closeModal('modal-add-exercise');
    renderActiveWorkout();
    triggerHaptic([40]);
  } else if (activePickerTarget === 'routine_builder') {
    // 1-Tap toggle: add or remove from routine
    if (!newRoutineSelectedExerciseIds.includes(ex.id)) {
      newRoutineSelectedExerciseIds.push(ex.id);
    } else {
      newRoutineSelectedExerciseIds = newRoutineSelectedExerciseIds.filter(id => id !== ex.id);
    }
    renderRoutineBuilderExercises();
    renderExercisePickerList();
    triggerHaptic([25]);
  }
};

function renderRoutineBuilderExercises() {
  const container = document.getElementById('routine-exercises-list');
  const countEl = document.getElementById('routine-selected-count');
  countEl.textContent = newRoutineSelectedExerciseIds.length;

  if (newRoutineSelectedExerciseIds.length === 0) {
    container.innerHTML = '<p class="placeholder-text">No exercises added yet.</p>';
    return;
  }

  container.innerHTML = newRoutineSelectedExerciseIds.map((id, idx) => {
    const ex = AppState.exercises.find(e => e.id === id);
    if (!ex) return '';
    return `
      <div class="builder-ex-item">
        <span>${escapeHtml(ex.name)} (${ex.category})</span>
        <button style="background:none;border:none;color:#ff3b30;cursor:pointer;font-weight:700;" onclick="removeBuilderEx(${idx})">&times;</button>
      </div>
    `;
  }).join('');
}

window.removeBuilderEx = function(idx) {
  newRoutineSelectedExerciseIds.splice(idx, 1);
  renderRoutineBuilderExercises();
};

window.switchCreateRoutineTab = function(tab) {
  const customView = document.getElementById('create-routine-custom-view');
  const featuredView = document.getElementById('create-routine-featured-view');
  const btnCustom = document.getElementById('tab-btn-create-custom');
  const btnFeatured = document.getElementById('tab-btn-create-featured');

  if (tab === 'featured') {
    if (customView) customView.classList.add('hidden');
    if (featuredView) featuredView.classList.remove('hidden');
    if (btnCustom) btnCustom.classList.remove('active');
    if (btnFeatured) btnFeatured.classList.add('active');
    renderFeaturedRoutineTemplates();
    triggerHaptic([25]);
  } else {
    if (customView) customView.classList.remove('hidden');
    if (featuredView) featuredView.classList.add('hidden');
    if (btnCustom) btnCustom.classList.add('active');
    if (btnFeatured) btnFeatured.classList.remove('active');
    triggerHaptic([25]);
  }
};

window.renderFeaturedRoutineTemplates = function() {
  const container = document.getElementById('create-routine-featured-list');
  if (!container) return;

  container.innerHTML = DEFAULT_ROUTINES.map(defR => {
    const exNames = defR.exerciseIds
      .map(id => {
        const found = AppState.exercises.find(e => e.id === id);
        return found ? found.name : '';
      })
      .filter(Boolean);

    return `
      <div class="featured-template-card">
        <div class="template-card-top">
          <div>
            <h4 class="template-card-title">${escapeHtml(defR.name)}</h4>
            <span class="template-card-tag">${escapeHtml(defR.tag || 'Featured')}</span>
          </div>
          <button type="button" class="template-load-btn" onclick="loadRoutineTemplate('${defR.id}')">
            Load Template &rarr;
          </button>
        </div>
        <p class="template-exercises-preview">${escapeHtml(exNames.join(' • '))}</p>
      </div>
    `;
  }).join('');
};

window.loadRoutineTemplate = function(templateId) {
  const template = DEFAULT_ROUTINES.find(r => r.id === templateId) || (AppState.routines || []).find(r => r.id === templateId);
  if (!template) return;

  newRoutineSelectedExerciseIds = [...template.exerciseIds];
  const nameInput = document.getElementById('new-routine-name');
  const tagInput = document.getElementById('new-routine-tag');
  const featuredCheck = document.getElementById('new-routine-is-featured');

  if (nameInput) nameInput.value = template.name;
  if (tagInput) tagInput.value = template.tag || '';
  if (featuredCheck) featuredCheck.checked = true;

  renderRoutineBuilderExercises();
  switchCreateRoutineTab('custom');
  triggerHaptic([40]);
  showToast(`Loaded "${template.name}" into builder!`);
};

// --- Modal Controls ---
window.openModal = function(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
};

window.closeModal = function(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
};

// --- QR Code & Local Network Link Modal ---
let cachedLanInfo = null;
async function fetchLanInfo() {
  try {
    const res = await fetch('/api/lan-info');
    if (res.ok) {
      cachedLanInfo = await res.json();
      const su = document.getElementById('scroll-status-url');
      if (su && cachedLanInfo.scrollUrl) su.textContent = cachedLanInfo.scrollUrl;
    }
  } catch (e) {}
}

function openQRModal() {
  const box = document.getElementById('qr-code-canvas-box');
  const input = document.getElementById('lan-url-input');
  const url = (cachedLanInfo && cachedLanInfo.appUrl) ? cachedLanInfo.appUrl : window.location.href;

  input.value = url;
  box.innerHTML = '';

  // Generate lightweight SVG QR code in browser
  generateQRCode(box, url, 180);
  openModal('modal-qr');
}

// Compact Pure JS QR Code generator using standard canvas
function generateQRCode(container, text, size) {
  // Use a reliable SVG/Canvas pattern or fallback Google chart / embedded QR algorithm
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Fill with clean background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);

  // We load a high-speed data QR generator or create an interactive QR display
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function() {
    ctx.drawImage(img, 0, 0, size, size);
    container.appendChild(canvas);
  };
  img.onerror = function() {
    // If offline, draw stylized QR matrix pattern with center target
    drawOfflineQRFallback(ctx, size, text);
    container.appendChild(canvas);
  };
  // Use high-reliability public QR API with local fallback
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&margin=1`;
}

function drawOfflineQRFallback(ctx, size, text) {
  ctx.fillStyle = '#060709';
  const cellSize = size / 21;
  // Corner markers
  function drawMarker(x, y) {
    ctx.fillRect(x, y, cellSize * 7, cellSize * 7);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + cellSize, y + cellSize, cellSize * 5, cellSize * 5);
    ctx.fillStyle = '#060709';
    ctx.fillRect(x + cellSize * 2, y + cellSize * 2, cellSize * 3, cellSize * 3);
  }
  drawMarker(cellSize * 1, cellSize * 1);
  drawMarker(size - cellSize * 8, cellSize * 1);
  drawMarker(cellSize * 1, size - cellSize * 8);

  // Decorative dots
  for (let r = 8; r < 19; r += 2) {
    for (let c = 8; c < 19; c += 2) {
      if ((r + c + text.length) % 3 === 0) {
        ctx.fillRect(c * cellSize, r * cellSize, cellSize * 1.5, cellSize * 1.5);
      }
    }
  }
}

// --- Doomscroll Bank ---
// 2 minutes of scroll per pull-up / push-up rep, and per minute of plank (plank reps = seconds).
const SCROLL_SECONDS_PER_UNIT = 120;

function scrollKind(name) {
  const n = (name || '').toLowerCase();
  if (/pull[\s-]?up|push[\s-]?up/.test(n)) return 'rep';
  if (/plank/.test(n)) return 'plank';
  return null;
}

function calcScrollCredit(name, reps) {
  if (AppState.settings.requireCamera !== false) return 0; // only camera-verified reps earn time
  const kind = scrollKind(name);
  const r = Number(reps) || 0;
  if (kind === 'rep') return r * SCROLL_SECONDS_PER_UNIT;
  if (kind === 'plank') return Math.floor(r / 60) * SCROLL_SECONDS_PER_UNIT;
  return 0;
}

function scrollHint(name) {
  const kind = scrollKind(name);
  if (kind && AppState.settings.requireCamera !== false) return ' \u2022 use Camera Coach to earn scroll time';
  if (kind === 'rep') return ' \u2022 +2 min scroll / rep';
  if (kind === 'plank') return ' \u2022 reps = seconds, +2 min / minute';
  return '';
}

function formatRest(s) {
  return s < 60 ? s + ' sec' : (s % 60 === 0 ? (s / 60) + ' min' : Math.floor(s / 60) + ' min ' + (s % 60) + ' sec');
}

function fmtClock(sec) {
  sec = Math.max(0, Math.round(sec));
  return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
}

function addScrollCredit(seconds, exName) {
  ensureScrollState();
  AppState.scroll.balance = Math.max(0, AppState.scroll.balance + seconds);
  if (seconds > 0) {
    AppState.scroll.earnedTotal = (AppState.scroll.earnedTotal || 0) + seconds;
    showToast('\uD83D\uDCF1 +' + fmtClock(seconds) + ' scroll time earned' + (exName ? ' (' + exName + ')' : ''));
  }
  saveState();
  renderScroll();
  syncScrollToServer();
}

function scrollRemaining() {
  const s = AppState.scroll;
  if (s.sessionEndsAt) return Math.max(0, Math.ceil((s.sessionEndsAt - Date.now()) / 1000));
  return s.balance;
}

function renderScroll() {
  ensureScrollState();
  const s = AppState.scroll;
  const balEl = document.getElementById('scroll-balance');
  const btn = document.getElementById('btn-scroll-toggle');
  const sub = document.getElementById('scroll-sub');
  if (balEl) {
    balEl.textContent = fmtClock(scrollRemaining());
  }
  const card = document.getElementById('scroll-card');
  if (btn && sub && card) {
    if (s.sessionEndsAt) {
      btn.textContent = 'Stop & Save';
      sub.textContent = 'Scrolling... clock is ticking';
      card.classList.add('scrolling');
    } else {
      btn.textContent = s.balance > 0 ? 'Start Scrolling' : 'Lock Feeds Now';
      sub.textContent = s.balance > 0 ? 'Banked time \u2013 spend it wisely' : 'Earn 2 min per pull-up, push-up & plank minute';
      card.classList.remove('scrolling');
    }
  }

  const shieldActive = Boolean(s.antiScrollActive);
  const dmEnabled = AppState.settings.dmOnlyMode !== false;

  // Relocate any stray banner from global root into view-focus if cached DOM had it outside
  const strayBanner = document.querySelector('.app-root > #antiscroll-live-banner, body > #antiscroll-live-banner');
  const focusView = document.getElementById('view-focus');
  if (strayBanner && focusView) {
    const heroBtn = focusView.querySelector('#btn-activate-antiscroll');
    if (heroBtn) {
      focusView.insertBefore(strayBanner, heroBtn);
    } else {
      focusView.appendChild(strayBanner);
    }
  }

  // Update Live Anti-Scroll Shield Banner (Strictly visible ONLY when on Focus tab)
  const liveBanner = document.getElementById('antiscroll-live-banner');
  const liveTimer  = document.getElementById('antiscroll-live-timer');
  const liveSub    = document.getElementById('antiscroll-live-sub');
  const isFocusActive = Boolean(focusView && focusView.classList.contains('active'));
  const shouldShowLiveBanner = shieldActive && isFocusActive;

  if (liveBanner) {
    liveBanner.classList.toggle('hidden', !shouldShowLiveBanner);
    liveBanner.style.setProperty('display', shouldShowLiveBanner ? 'flex' : 'none', 'important');
  }
  if (liveTimer && shieldActive) {
    const elapsedSec = s.antiScrollStartedAt ? Math.max(0, Math.floor((Date.now() - s.antiScrollStartedAt) / 1000)) : 0;
    liveTimer.textContent = formatDuration(elapsedSec);
  }
  if (liveSub && shieldActive) {
    const elapsedSec = s.antiScrollStartedAt ? Math.max(0, Math.floor((Date.now() - s.antiScrollStartedAt) / 1000)) : 0;
    const modeLabel = dmEnabled ? 'DMs & 1 Friend Reel allowed' : 'Strict Full Block';
    liveSub.innerHTML = `Feeds blocked &bull; ${modeLabel} &bull; <b id="antiscroll-live-timer">${formatDuration(elapsedSec)}</b>`;
  }

  // Update Non-Scrolling Messenger Shield UI
  const dmToggle = document.getElementById('setting-dm-only-mode');
  const dmBadge  = document.getElementById('noscroll-status-badge');
  const dmCard   = document.getElementById('noscroll-dm-card');
  if (dmToggle) dmToggle.checked = dmEnabled;
  if (dmBadge) {
    dmBadge.innerHTML = dmEnabled
      ? (shieldActive ? '&#128737;&#65039; ANTI-SCROLL SHIELD ACTIVE' : '&#128172; DM &amp; FRIEND REEL MODE READY')
      : '&#128274; STRICT FULL BLOCK MODE';
    dmBadge.classList.toggle('strict', !dmEnabled);
  }
  if (dmCard) {
    dmCard.classList.toggle('dm-disabled', !dmEnabled);
  }

  // Update Header 1-Tap Anti-Scroll Pill
  const headerBtn = document.getElementById('header-antiscroll-btn');
  const headerLbl = document.getElementById('header-antiscroll-label');
  if (headerBtn) {
    headerBtn.classList.toggle('active', shieldActive);
  }
  if (headerLbl) {
    headerLbl.innerHTML = shieldActive
      ? '&#128737;&#65039; Anti-Scroll: ON'
      : '&#9889; Activate Anti-Scroll';
  }

  // Update Focus Tab 1-Tap Hero Anti-Scroll Button
  const heroBtn   = document.getElementById('btn-activate-antiscroll');
  const heroIcon  = document.getElementById('antiscroll-hero-icon');
  const heroTitle = document.getElementById('antiscroll-hero-title');
  const heroSub   = document.getElementById('antiscroll-hero-sub');
  const heroPill  = document.getElementById('antiscroll-hero-pill');
  if (heroBtn) {
    heroBtn.classList.toggle('active', shieldActive);
  }
  if (heroIcon) {
    heroIcon.innerHTML = shieldActive ? '&#128737;&#65039;' : '&#9889;';
  }
  if (heroTitle) {
    heroTitle.innerHTML = shieldActive
      ? 'ANTI-SCROLL SHIELD: ACTIVE (DMs &amp; Friend Reels Only)'
      : 'TAP TO ACTIVATE ANTI-SCROLL SHIELD';
  }
  if (heroSub) {
    heroSub.textContent = shieldActive
      ? 'Infinite Reels & Home feeds are blocked! Open IG Chat Inbox or watch a single friend-sent Reel below. Tap to turn off.'
      : '1-Tap Shield: Stops endless doomscrolling while keeping Instagram Chat Inbox & friend-sent Reels unlocked!';
  }
  if (heroPill) {
    heroPill.textContent = shieldActive ? 'ACTIVE' : 'ACTIVATE';
  }

  // Update Instant Block, Scheduled Block and Distraction Targets UI
  if (typeof updateFocusBlockUI === 'function') {
    updateFocusBlockUI();
  }
}

function updateAntiScrollUI() {
  renderScroll();
}
window.updateAntiScrollUI = updateAntiScrollUI;

function setAntiScrollMode(enabled, openFocusIfActivated = false) {
  ensureScrollState();
  const turnOn = Boolean(enabled);
  AppState.scroll.antiScrollActive = turnOn;
  if (turnOn) {
    // If a paid scroll session was running, pause it and bank remaining time so Instagram & YouTube Shorts lock immediately
    if (AppState.scroll.sessionEndsAt) {
      AppState.scroll.balance = scrollRemaining();
      AppState.scroll.sessionEndsAt = null;
    }
    if (!AppState.scroll.antiScrollStartedAt) {
      AppState.scroll.antiScrollStartedAt = Date.now();
    }
    if (AppState.settings.dmOnlyMode === false) {
      AppState.settings.dmOnlyMode = true;
    }
    playSetCompletePing();
    triggerHaptic([50, 30, 70]);
  } else {
    AppState.scroll.antiScrollStartedAt = null;
    triggerHaptic([35]);
  }
  saveState();
  renderScroll();
  syncScrollToServer();

  if (turnOn && openFocusIfActivated) {
    const focusView = document.getElementById('view-focus');
    if (!focusView || !focusView.classList.contains('active')) {
      switchTab('focus');
    }
  }

  showToast(turnOn
    ? '\uD83D\uDEE1\uFE0F Anti-Scroll Shield LOCKED! IG Reels & YouTube Shorts blocked \u2014 IG Chat Inbox & 1 Friend Reel allowed.'
    : '\u26A1 Anti-Scroll Shield paused.');
}
window.setAntiScrollMode = setAntiScrollMode;

let lastAntiScrollToggleTs = 0;
function toggleAntiScrollMode(fromHeader = false) {
  const now = Date.now();
  if (now - lastAntiScrollToggleTs < 200) return;
  lastAntiScrollToggleTs = now;

  ensureScrollState();
  const currentlyActive = Boolean(AppState.scroll.antiScrollActive) && !AppState.scroll.sessionEndsAt;
  if (!currentlyActive) {
    // Immediately turn Anti-Scroll ON and stop any active scroll timer
    setAntiScrollMode(true, fromHeader);
  } else {
    // Already active -> never accidentally disable the blocker! Jump to Focus & open the Anti-Scroll Lock Shield
    if (fromHeader) {
      const focusView = document.getElementById('view-focus');
      if (!focusView || !focusView.classList.contains('active')) {
        switchTab('focus');
      }
    }
    openAntiScrollLockScreen();
    showToast('\uD83D\uDEE1\uFE0F Anti-Scroll Shield is ACTIVE & locking feeds!');
  }
}
window.toggleAntiScrollMode = toggleAntiScrollMode;

// --- Focus Tab: Instant Block & Scheduled Block Controls ---
function isScheduledBlockActiveNow() {
  ensureFocusBlockState();
  const sched = AppState.focusBlock && AppState.focusBlock.schedule;
  if (!sched || !sched.enabled) return false;

  const now = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayName = dayNames[now.getDay()];
  if (Array.isArray(sched.days) && !sched.days.includes(todayName)) {
    return false;
  }

  const pad = n => String(n).padStart(2, '0');
  const nowStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const startStr = sched.startTime || '09:00';
  const endStr = sched.endTime || '17:00';

  if (startStr <= endStr) {
    return nowStr >= startStr && nowStr <= endStr;
  } else {
    // Overnight window (e.g. 22:00 to 06:00)
    return nowStr >= startStr || nowStr <= endStr;
  }
}
window.isScheduledBlockActiveNow = isScheduledBlockActiveNow;

function selectInstantDuration(mins) {
  ensureFocusBlockState();
  const num = Number(mins) || 0;
  AppState.focusBlock.instantDurationMinutes = num;
  if (AppState.focusBlock.instantActive) {
    AppState.focusBlock.instantEndsAt = num > 0 ? (Date.now() + num * 60 * 1000) : null;
  }
  saveState();
  updateFocusBlockUI();
  triggerHaptic([20]);
}
window.selectInstantDuration = selectInstantDuration;

function toggleInstantBlock() {
  ensureFocusBlockState();
  if (AppState.focusBlock.instantActive) {
    // Opal Gesture Rule: When active lockdown is in progress, simple accidental taps are rejected.
    // User must perform the 3-second hold gesture on the Hold to Cancel button.
    const holdContainer = document.getElementById('opal-hold-cancel-container');
    const holdBtn = document.getElementById('opal-hold-cancel-btn');
    if (holdContainer) holdContainer.classList.remove('hidden');
    if (holdBtn) {
      holdBtn.classList.remove('pulse-alert');
      void holdBtn.offsetWidth; // trigger reflow
      holdBtn.classList.add('pulse-alert');
    }
    triggerHaptic([35, 20]);
    const alertMsg = window.t
      ? window.t('hold_protected_alert')
      : '⚠️ Active lockdown protected! Press and hold the Cancel button for 3 seconds.';
    showToast(alertMsg);
  } else {
    startInstantBlock(AppState.focusBlock.instantDurationMinutes || 15);
  }
}
window.toggleInstantBlock = toggleInstantBlock;

function startInstantBlock(mins) {
  ensureFocusBlockState();
  ensureScrollState();
  const num = Number(mins) || 15;
  AppState.focusBlock.instantActive = true;
  AppState.focusBlock.instantDurationMinutes = num;
  AppState.focusBlock.instantEndsAt = num > 0 ? (Date.now() + num * 60 * 1000) : null;
  AppState.scroll.antiScrollActive = true;

  // Pause and bank any active paid scroll timer
  if (AppState.scroll.sessionEndsAt) {
    AppState.scroll.balance = scrollRemaining();
    AppState.scroll.sessionEndsAt = null;
  }

  playSetCompletePing();
  triggerHaptic([60, 40, 80]);
  saveState();
  updateFocusBlockUI();
  syncScrollToServer();

  showToast('⚡ INSTANT BLOCK ACTIVE! YouTube Shorts, games, and distracting feeds locked.');
}
window.startInstantBlock = startInstantBlock;

function stopInstantBlock() {
  ensureFocusBlockState();
  AppState.focusBlock.instantActive = false;
  AppState.focusBlock.instantEndsAt = null;
  triggerHaptic([30]);
  saveState();
  updateFocusBlockUI();
  syncScrollToServer();
  showToast('⚡ Instant Block deactivated.');
}
window.stopInstantBlock = stopInstantBlock;

// ==================== OPAL-STYLE FUTURISTIC HOLD-TO-CANCEL GESTURE ====================
let holdCancelAnimId = null;
let holdCancelStartTime = 0;
let holdIsActive = false;
const HOLD_CANCEL_DURATION_MS = 3000;
const HOLD_RING_CIRCUMFERENCE = 314.16; // 2 * PI * 50

function initHoldToCancel() {
  const holdBtn = document.getElementById('opal-hold-cancel-btn');
  const instantHeroBtn = document.getElementById('opal-btn-instant-block');
  const targets = [holdBtn, instantHeroBtn].filter(Boolean);

  const ringFill = document.getElementById('opal-hold-ring-fill');
  const countdownEl = document.getElementById('opal-hold-countdown');
  const holdWrapper = document.getElementById('opal-hold-btn-wrapper');

  if (ringFill) {
    ringFill.style.strokeDasharray = `${HOLD_RING_CIRCUMFERENCE}`;
    ringFill.style.strokeDashoffset = `${HOLD_RING_CIRCUMFERENCE}`;
  }

  function resetHoldVisuals() {
    if (holdCancelAnimId) {
      cancelAnimationFrame(holdCancelAnimId);
      holdCancelAnimId = null;
    }
    holdIsActive = false;
    holdCancelStartTime = 0;

    if (ringFill) {
      ringFill.style.strokeDashoffset = `${HOLD_RING_CIRCUMFERENCE}`;
    }
    if (countdownEl) {
      const isRTL = window.I18N && window.I18N.isRTL();
      countdownEl.textContent = isRTL ? 'اضغط 3 ثوانٍ' : 'Hold 3s';
    }
    if (holdWrapper) {
      holdWrapper.classList.remove('is-holding');
    }
    targets.forEach(el => el.classList.remove('is-holding'));
  }

  function onPointerDown(e) {
    ensureFocusBlockState();
    // Only engage hold-to-cancel if an active block or lockdown is running
    if (!AppState.focusBlock.instantActive && !AppState.scroll.antiScrollActive) {
      return;
    }

    // Only left click on mouse
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    if (e.cancelable) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();

    resetHoldVisuals();
    holdIsActive = true;
    holdCancelStartTime = performance.now();

    if (holdWrapper) holdWrapper.classList.add('is-holding');
    e.currentTarget.classList.add('is-holding');

    triggerHaptic([35]);

    let lastRemainingInteger = 3;

    function animateHold(now) {
      if (!holdIsActive) return;

      const elapsed = now - holdCancelStartTime;
      const progress = Math.min(1, elapsed / HOLD_CANCEL_DURATION_MS);

      // Animate glowing maroon SVG progress ring filling up
      if (ringFill) {
        ringFill.style.strokeDashoffset = `${HOLD_RING_CIRCUMFERENCE * (1 - progress)}`;
      }

      // Live countdown display
      const remainingSec = Math.max(0, (HOLD_CANCEL_DURATION_MS - elapsed) / 1000);
      const isRTL = window.I18N && window.I18N.isRTL();
      if (countdownEl) {
        countdownEl.textContent = `${remainingSec.toFixed(1)}${isRTL ? ' ث' : 's'}`;
      }

      // Haptic pulse for each full second held
      const currentInt = Math.ceil(remainingSec);
      if (currentInt < lastRemainingInteger && currentInt > 0) {
        lastRemainingInteger = currentInt;
        triggerHaptic([25]);
      }

      // If held for the full 3 seconds, execute the pause/cancel function and trigger haptic feedback
      if (progress >= 1) {
        holdIsActive = false;
        holdCancelAnimId = null;

        // Rich haptic feedback + success ping
        triggerHaptic([60, 40, 100, 50, 180]);
        playSetCompletePing();

        // Execute pause/cancel function
        stopInstantBlock();
        if (AppState.scroll.antiScrollActive) {
          AppState.scroll.antiScrollActive = false;
          saveState();
        }

        const successMsg = window.t
          ? window.t('hold_cancelled_toast')
          : '🛑 Lockdown successfully cancelled after 3s hold!';
        showToast(successMsg);

        resetHoldVisuals();
        return;
      }

      holdCancelAnimId = requestAnimationFrame(animateHold);
    }

    holdCancelAnimId = requestAnimationFrame(animateHold);
  }

  function onPointerUp(e) {
    if (!holdIsActive) return;
    const heldTime = performance.now() - holdCancelStartTime;

    resetHoldVisuals();

    // If released early, instantly reset progress to zero and alert if user attempted hold
    if (heldTime >= 350) {
      triggerHaptic([15]);
      const earlyMsg = window.t
        ? window.t('hold_early_toast')
        : '⚠️ Keep holding for full 3 seconds to break lockdown!';
      showToast(earlyMsg);
    }
  }

  // Bind pointer listeners across target elements
  targets.forEach((target) => {
    target.addEventListener('pointerdown', onPointerDown, { passive: false });
    target.addEventListener('pointerup', onPointerUp, { passive: true });
    target.addEventListener('pointercancel', onPointerUp, { passive: true });
    target.addEventListener('pointerleave', onPointerUp, { passive: true });
  });

  window.addEventListener('pointerup', onPointerUp, { passive: true });
  window.addEventListener('pointercancel', onPointerUp, { passive: true });
}
window.initHoldToCancel = initHoldToCancel;

function toggleScheduledBlockEnabled(enabled) {
  ensureFocusBlockState();
  AppState.focusBlock.schedule.enabled = Boolean(enabled);
  triggerHaptic([25]);
  saveState();
  updateFocusBlockUI();
  syncScrollToServer();
  showToast(`⏰ Scheduled Block ${enabled ? 'ENABLED' : 'PAUSED'}.`);
}
window.toggleScheduledBlockEnabled = toggleScheduledBlockEnabled;

function updateScheduledBlockTimes() {
  ensureFocusBlockState();
  const sInput = document.getElementById('schedule-start-time');
  const eInput = document.getElementById('schedule-end-time');
  if (sInput && sInput.value) AppState.focusBlock.schedule.startTime = sInput.value;
  if (eInput && eInput.value) AppState.focusBlock.schedule.endTime = eInput.value;
  saveState();
  updateFocusBlockUI();
  syncScrollToServer();
  showToast('Focus schedule updated!');
}
window.updateScheduledBlockTimes = updateScheduledBlockTimes;

function toggleScheduleDay(day) {
  ensureFocusBlockState();
  const days = AppState.focusBlock.schedule.days || [];
  const idx = days.indexOf(day);
  if (idx > -1) {
    if (days.length > 1) days.splice(idx, 1);
    else {
      showToast('At least 1 active day required.');
      return;
    }
  } else {
    days.push(day);
  }
  AppState.focusBlock.schedule.days = days;
  triggerHaptic([20]);
  saveState();
  updateFocusBlockUI();
  syncScrollToServer();
}
window.toggleScheduleDay = toggleScheduleDay;

function toggleDistractionTarget(key, isChecked) {
  ensureFocusBlockState();
  AppState.focusBlock.targets[key] = Boolean(isChecked);
  triggerHaptic([25]);
  saveState();
  updateFocusBlockUI();
  syncScrollToServer();

  const labels = {
    youtubeShorts: 'YouTube Shorts',
    games: 'Mobile & PC Games',
    instagramReels: 'Instagram Reels & Feeds',
    tiktok: 'TikTok & Fast Feeds'
  };
  showToast(`${labels[key] || key} restriction ${isChecked ? 'ACTIVATED' : 'DISABLED'}.`);
}
window.toggleDistractionTarget = toggleDistractionTarget;

function addCustomDistractionTarget() {
  ensureFocusBlockState();
  const input = document.getElementById('input-custom-distraction');
  if (!input || !input.value.trim()) return;
  const tag = input.value.trim();
  if (!AppState.focusBlock.targets.customApps.includes(tag)) {
    AppState.focusBlock.targets.customApps.push(tag);
    saveState();
    updateFocusBlockUI();
    syncScrollToServer();
    showToast(`Added "${tag}" to designated blocklist!`);
  }
  input.value = '';
}
window.addCustomDistractionTarget = addCustomDistractionTarget;

function removeCustomDistractionTarget(tag) {
  ensureFocusBlockState();
  const list = AppState.focusBlock.targets.customApps;
  const idx = list.indexOf(tag);
  if (idx > -1) {
    list.splice(idx, 1);
    saveState();
    updateFocusBlockUI();
    syncScrollToServer();
    showToast(`Removed "${tag}" from blocklist.`);
  }
}
window.removeCustomDistractionTarget = removeCustomDistractionTarget;

function toggleOpalScheduleDrawer() {
  const drawer = document.getElementById('opal-schedule-drawer');
  if (drawer) {
    drawer.classList.toggle('hidden');
    triggerHaptic([20]);
  }
}
window.toggleOpalScheduleDrawer = toggleOpalScheduleDrawer;

function updateFocusBlockUI() {
  ensureFocusBlockState();
  const fb = AppState.focusBlock;
  const cardInstant = document.getElementById('card-instant-block');
  const pillInstant = document.getElementById('instant-block-pill');
  const timerDisplay = document.getElementById('instant-timer-display');
  const countdownDigits = document.getElementById('instant-countdown-digits');
  const btnToggle = document.getElementById('btn-toggle-instant-block');

  // Opal-Style Focus Button Elements
  const opalInstantBtn = document.getElementById('opal-btn-instant-block');
  const opalInstantTitle = document.getElementById('opal-instant-title');
  const opalInstantSub = document.getElementById('opal-instant-sub');
  const opalInstantBadge = document.getElementById('opal-instant-badge');
  const opalSchedSub = document.getElementById('opal-sched-sub');
  const opalSchedBadge = document.getElementById('opal-sched-badge');

  // Handle Instant Block Countdown
  const isInstant = Boolean(fb.instantActive);
  let remSec = 0;
  if (isInstant) {
    if (fb.instantEndsAt) {
      remSec = Math.max(0, Math.floor((fb.instantEndsAt - Date.now()) / 1000));
      if (remSec <= 0) {
        fb.instantActive = false;
        fb.instantEndsAt = null;
        saveState();
        showToast('⚡ Instant Block completed!');
        syncScrollToServer();
      }
    }
  }

  // Update Futuristic Opal Hold-to-Cancel Container
  const holdContainer = document.getElementById('opal-hold-cancel-container');
  if (holdContainer) {
    holdContainer.classList.toggle('hidden', !fb.instantActive);
  }

  // Update Opal Instant Block Pill
  if (opalInstantBtn) {
    opalInstantBtn.classList.toggle('active-lockdown', Boolean(fb.instantActive));
  }
  if (opalInstantTitle) {
    const isRTL = window.I18N && window.I18N.isRTL();
    if (fb.instantActive) {
      opalInstantTitle.textContent = isRTL ? 'إغلاق فوري مشدد' : 'Instant Lockdown';
    } else {
      opalInstantTitle.textContent = isRTL ? 'حظر فوري' : 'Instant Block';
    }
  }
  if (opalInstantSub) {
    const isRTL = window.I18N && window.I18N.isRTL();
    if (fb.instantActive) {
      if (isRTL) {
        opalInstantSub.textContent = fb.instantEndsAt ? `${formatDuration(remSec)} متبقية • التطبيقات مقيدة` : 'نشط • التطبيقات مقيدة';
      } else {
        opalInstantSub.textContent = fb.instantEndsAt ? `${formatDuration(remSec)} REMAINING • APPS LOCKED` : 'ACTIVE • APPS RESTRICTED';
      }
    } else {
      const mins = fb.instantDurationMinutes;
      const durText = (mins === 0 || mins === '0') ? (isRTL ? 'مفتوح' : 'INDEFINITE') : (mins >= 60 ? `${mins / 60}${isRTL ? 'س' : 'H'}` : `${mins || 15}${isRTL ? 'د' : 'M'}`);
      if (isRTL) {
        opalInstantSub.textContent = `حظر لمدة ${durText} • المس للبدء`;
      } else {
        opalInstantSub.textContent = `${durText} LOCKDOWN • TAP TO BEGIN`;
      }
    }
  }
  if (opalInstantBadge) {
    const isRTL = window.I18N && window.I18N.isRTL();
    if (fb.instantActive) {
      opalInstantBadge.className = 'opal-badge-pill lockdown';
      opalInstantBadge.textContent = isRTL ? 'إنهاء' : 'END';
    } else {
      opalInstantBadge.className = 'opal-badge-pill';
      opalInstantBadge.textContent = isRTL ? 'بدء' : 'START';
    }
  }

  // Fallback Legacy Instant Elements
  if (cardInstant) {
    cardInstant.classList.toggle('active-lockdown', Boolean(fb.instantActive));
  }
  if (pillInstant) {
    pillInstant.className = `focus-status-pill ${fb.instantActive ? 'active' : 'idle'}`;
    pillInstant.textContent = fb.instantActive ? (fb.instantEndsAt ? `${formatDuration(remSec)} LEFT` : 'ACTIVE') : 'IDLE';
  }
  if (timerDisplay) {
    timerDisplay.classList.toggle('hidden', !fb.instantActive);
  }
  if (countdownDigits) {
    countdownDigits.textContent = fb.instantEndsAt ? formatDuration(remSec) : 'INDEFINITE';
  }
  if (btnToggle) {
    if (fb.instantActive) {
      btnToggle.className = 'danger-btn full-width';
      btnToggle.innerHTML = '<span>🛑 End Instant Block</span>';
    } else {
      btnToggle.className = 'primary-glow-btn full-width';
      btnToggle.innerHTML = '<span>⚡ Start Instant Block</span>';
    }
  }

  // Duration chips active state (both Opal micro-chips and standard chips)
  document.querySelectorAll('.opal-micro-chip, .duration-chip').forEach(chip => {
    const mins = Number(chip.dataset.mins);
    chip.classList.toggle('active', mins === (fb.instantDurationMinutes || 15));
  });

  // Scheduled Block UI
  const isSchedActive = isScheduledBlockActiveNow();
  const schedSwitch = document.getElementById('setting-scheduled-block');
  const sInput = document.getElementById('schedule-start-time');
  const eInput = document.getElementById('schedule-end-time');
  const dot = document.getElementById('schedule-indicator-dot');
  const statusText = document.getElementById('schedule-status-text');

  if (schedSwitch) schedSwitch.checked = Boolean(fb.schedule.enabled);
  if (sInput && fb.schedule.startTime) sInput.value = fb.schedule.startTime;
  if (eInput && fb.schedule.endTime) eInput.value = fb.schedule.endTime;

  // Day chips active state (both Opal day-chips and standard day-chips)
  document.querySelectorAll('.opal-day-chip, .day-chip').forEach(chip => {
    const day = chip.dataset.day;
    chip.classList.toggle('active', Boolean(fb.schedule.days && fb.schedule.days.includes(day)));
  });

  // Update Opal Scheduled Block Pill
  if (opalSchedSub) {
    if (isSchedActive) {
      opalSchedSub.textContent = `ACTIVE NOW • RESTRICTING (${fb.schedule.startTime} - ${fb.schedule.endTime})`;
    } else if (fb.schedule.enabled) {
      const daysStr = (fb.schedule.days && fb.schedule.days.length) ? fb.schedule.days.join(', ') : 'MON-FRI';
      opalSchedSub.textContent = `${daysStr} • ${fb.schedule.startTime} - ${fb.schedule.endTime}`;
    } else {
      opalSchedSub.textContent = 'SCHEDULE PAUSED • TAP TO CONFIGURE';
    }
  }
  if (opalSchedBadge) {
    if (isSchedActive) {
      opalSchedBadge.className = 'opal-badge-pill lockdown';
      opalSchedBadge.textContent = 'LOCKDOWN';
    } else if (fb.schedule.enabled) {
      opalSchedBadge.className = 'opal-badge-pill active';
      opalSchedBadge.textContent = 'ACTIVE';
    } else {
      opalSchedBadge.className = 'opal-badge-pill';
      opalSchedBadge.textContent = 'OFF';
    }
  }

  if (dot) {
    dot.className = `schedule-indicator-dot ${isSchedActive ? 'active' : (fb.schedule.enabled ? 'waiting' : 'off')}`;
  }
  if (statusText) {
    if (isSchedActive) {
      statusText.innerHTML = `<strong>⚡ ACTIVE NOW:</strong> Restricting apps (${fb.schedule.startTime} &ndash; ${fb.schedule.endTime})`;
    } else if (fb.schedule.enabled) {
      statusText.innerHTML = `Schedule Ready &bull; Active ${fb.schedule.days.join(', ')} (${fb.schedule.startTime} &ndash; ${fb.schedule.endTime})`;
    } else {
      statusText.textContent = 'Scheduled Block Paused';
    }
  }

  // Distraction Targets UI
  const targetYt = document.getElementById('target-yt-shorts');
  const targetGames = document.getElementById('target-games');
  const targetIg = document.getElementById('target-ig-reels');
  const targetTiktok = document.getElementById('target-tiktok');
  const countPill = document.getElementById('dt-active-count');

  if (targetYt) targetYt.checked = fb.targets.youtubeShorts !== false;
  if (targetGames) targetGames.checked = fb.targets.games !== false;
  if (targetIg) targetIg.checked = fb.targets.instagramReels !== false;
  if (targetTiktok) targetTiktok.checked = fb.targets.tiktok !== false;

  let activeCount = 0;
  if (fb.targets.youtubeShorts) activeCount++;
  if (fb.targets.games) activeCount++;
  if (fb.targets.instagramReels) activeCount++;
  if (fb.targets.tiktok) activeCount++;
  if (Array.isArray(fb.targets.customApps)) activeCount += fb.targets.customApps.length;

  if (countPill) {
    countPill.textContent = `${activeCount} App${activeCount === 1 ? '' : 's'} Restricted`;
  }

  const tagsContainer = document.getElementById('dt-custom-tags-container');
  if (tagsContainer) {
    tagsContainer.innerHTML = (fb.targets.customApps || []).map(app => `
      <span class="custom-app-tag">
        <span>${escapeHtml(app)}</span>
        <span class="custom-app-tag-del" onclick="removeCustomDistractionTarget('${escapeHtml(app)}')">&times;</span>
      </span>
    `).join('');
  }
}
window.updateFocusBlockUI = updateFocusBlockUI;

// --- FAQ & Knowledge Base Logic ---
window.toggleFaqItem = function(id) {
  const item = document.getElementById(id);
  if (item) {
    item.classList.toggle('open');
    triggerHaptic([25]);
  }
};

window.selectFaqCategory = function(cat) {
  document.querySelectorAll('.faq-cat-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });
  document.querySelectorAll('.faq-item').forEach(item => {
    if (cat === 'all' || item.dataset.cat === cat) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
  triggerHaptic([20]);
};

window.filterFaqSearch = function(query) {
  const q = (query || '').toLowerCase().trim();
  document.querySelectorAll('.faq-item').forEach(item => {
    const text = item.textContent.toLowerCase();
    const matches = !q || text.includes(q);
    item.style.display = matches ? 'block' : 'none';
    if (q && matches) {
      item.classList.add('open');
    }
  });
};

window.navigateToSettingsFaq = function(category) {
  switchTab('settings');
  if (category && typeof window.selectFaqCategory === 'function') {
    window.selectFaqCategory(category);
  }
  setTimeout(() => {
    const el = document.getElementById('settings-faq-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 120);
};

window.askCoachFromFaq = function(promptText) {
  openAICoachModal();
  setTimeout(() => {
    if (typeof window.askCoachPrompt === 'function') {
      window.askCoachPrompt(promptText);
    }
  }, 150);
};

async function installPcBrowserBlocker() {
  let extPath = 'c:\\Users\\nurvi\\Downloads\\PortableGit\\fitness_tracker_app\\moon_antiscroll_extension';
  try {
    const res = await fetch('/api/open-extension-folder');
    if (res.ok) {
      const data = await res.json();
      if (data && data.path) extPath = data.path;
    }
  } catch (e) {}
  try {
    await navigator.clipboard.writeText(extPath);
  } catch (e) {}
  showToast('\uD83E\uDDE9 Extension folder opened & path copied! Load it in chrome://extensions or edge://extensions');
  alert(
    'HOW TO BLOCK INSTAGRAM REELS & YOUTUBE SHORTS IN YOUR PC BROWSER (10 SECONDS):\n\n' +
    '1. We just copied the extension folder path to your clipboard (and opened the folder):\n   ' + extPath + '\n\n' +
    '2. Open a new tab and type:  chrome://extensions  (or edge://extensions)\n' +
    '3. Turn ON "Developer mode" (top-right switch).\n' +
    '4. Click "Load unpacked" (top-left) and paste/select the moon_antiscroll_extension folder.\n\n' +
    'Done! YouTube Shorts (/shorts) and Instagram Feeds are now physically blocked in your browser while Instagram Chat Inbox (/direct/inbox/) and 1 Friend-Sent Reel stay unlocked!'
  );
}
window.installPcBrowserBlocker = installPcBrowserBlocker;

function openAntiScrollLockScreen() {
  ensureScrollState();
  if (!AppState.scroll.antiScrollActive) {
    AppState.scroll.antiScrollActive = true;
    AppState.scroll.antiScrollStartedAt = Date.now();
    saveState();
    renderScroll();
    syncScrollToServer();
  }
  const ov = document.getElementById('scroll-lock-overlay');
  if (ov) ov.classList.remove('hidden');
  triggerHaptic([50, 40, 60]);
}
window.openAntiScrollLockScreen = openAntiScrollLockScreen;

function focusFriendReelBox() {
  const box = document.getElementById('friend-reel-box');
  const inp = document.getElementById('friend-reel-url-input');
  if (box) box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  if (inp) setTimeout(() => inp.focus(), 250);
}
window.focusFriendReelBox = focusFriendReelBox;

function toggleScrollSession() {
  ensureScrollState();
  const s = AppState.scroll;
  if (s.sessionEndsAt) {
    s.balance = scrollRemaining();
    s.sessionEndsAt = null;
  } else {
    if (s.balance <= 0) {
      // Activate Anti-Scroll Lock Shield immediately when user has 0:00 scroll balance
      openAntiScrollLockScreen();
      showToast('\uD83D\uDEE1\uFE0F 0:00 Scroll Time \u2014 Anti-Scroll Shield Lock Engaged!');
      return;
    }
    s.sessionEndsAt = Date.now() + s.balance * 1000;
    s.balance = 0;
    requestNotifyPermission();
  }
  saveState();
  renderScroll();
  syncScrollToServer();
}

function scrollTick() {
  if (!AppState.scroll) return;
  const s = AppState.scroll;
  if (s.sessionEndsAt && Date.now() >= s.sessionEndsAt) {
    unmountInstagramWebView(true);
  }
  renderScroll();
}

window.closeScrollLock = function() {
  const ov = document.getElementById('scroll-lock-overlay');
  if (ov) ov.classList.add('hidden');
};

// Tell the PC server how much scroll time is live so the iOS Shortcut / Userscript can enforce DM-only mode.
function syncScrollToServer() {
  ensureScrollState();
  ensureFocusBlockState();
  const s = AppState.scroll;
  const fb = AppState.focusBlock;
  const remaining = s && s.sessionEndsAt ? scrollRemaining() : 0;
  const dmOnly = AppState.settings && AppState.settings.dmOnlyMode !== false;
  const antiScrollActive = Boolean(s && s.antiScrollActive);
  const instantActive = Boolean(fb && fb.instantActive);
  const scheduledActive = typeof isScheduledBlockActiveNow === 'function' ? isScheduledBlockActiveNow() : false;
  const focusBlocked = instantActive || scheduledActive;

  const blockedApps = [];
  if (fb && fb.targets) {
    if (fb.targets.youtubeShorts) blockedApps.push('youtube_shorts');
    if (fb.targets.games) blockedApps.push('games');
    if (fb.targets.instagramReels) blockedApps.push('instagram_reels');
    if (fb.targets.tiktok) blockedApps.push('tiktok');
    if (Array.isArray(fb.targets.customApps)) blockedApps.push(...fb.targets.customApps);
  }

  try {
    fetch('/api/scroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        remainingSeconds: remaining,
        dmOnly,
        antiScrollActive,
        instantActive,
        scheduledActive,
        focusBlocked,
        blockedApps
      })
    }).catch(() => {});
  } catch (e) {}
}

// --- In-App Instagram WebView with Strict Scroll Bank Countdown & Auto-Unmount ---
let igCountdownRafId = null;
let igCountdownIntervalId = null;
let igSessionStartDurationMs = 0;

function updateIgCountdownOverlay() {
  const s = AppState.scroll;
  if (!s) return;

  const now = Date.now();
  const remainingMs = s.sessionEndsAt ? (s.sessionEndsAt - now) : 0;

  // The EXACT millisecond the timer reaches zero: unmount and lock down immediately
  if (remainingMs <= 0) {
    unmountInstagramWebView(true);
    return;
  }

  const digitsEl = document.getElementById('ig-countdown-digits');
  const progressEl = document.getElementById('ig-countdown-progress');
  const overlayEl = document.getElementById('ig-webview-countdown-overlay');
  const statusEl = document.getElementById('ig-countdown-status-text');

  const totalSec = Math.max(0, Math.floor(remainingMs / 1000));
  const tenths = Math.floor((remainingMs % 1000) / 100);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  const formattedDigits = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0') + '.' + tenths;

  if (digitsEl) digitsEl.textContent = formattedDigits;

  const dedDigitsEl = document.getElementById('d-ig-timer-digits');
  if (dedDigitsEl) {
    dedDigitsEl.textContent = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
  }

  if (progressEl && igSessionStartDurationMs > 0) {
    const pct = Math.min(100, Math.max(0, (remainingMs / igSessionStartDurationMs) * 100));
    progressEl.style.width = pct.toFixed(1) + '%';
  }

  if (overlayEl && statusEl) {
    if (remainingMs <= 10000) {
      overlayEl.classList.remove('warning');
      overlayEl.classList.add('critical');
      statusEl.textContent = 'CRITICAL \u2022 LOCKING IN <10S';
    } else if (remainingMs <= 60000) {
      overlayEl.classList.add('warning');
      overlayEl.classList.remove('critical');
      statusEl.textContent = 'BANK EXPIRING SOON';
    } else {
      overlayEl.classList.remove('warning', 'critical');
      statusEl.textContent = 'SCROLL BANK LIVE';
    }
  }

  // Sync to iframe via postMessage if loaded
  const iframe = document.getElementById('ig-direct-webview-iframe');
  if (iframe && iframe.contentWindow) {
    try {
      iframe.contentWindow.postMessage({ type: 'MOON_SCROLL_BANK_TICK', remainingMs }, '*');
    } catch (e) {}
  }
}

function startIgCountdownTicker() {
  stopIgCountdownTicker();
  updateIgCountdownOverlay();

  // High-frequency ticker: RAF with 50ms fallback interval for background safety
  function loop() {
    updateIgCountdownOverlay();
    if (AppState.scroll && AppState.scroll.sessionEndsAt && Date.now() < AppState.scroll.sessionEndsAt) {
      igCountdownRafId = requestAnimationFrame(loop);
    }
  }
  igCountdownRafId = requestAnimationFrame(loop);
  igCountdownIntervalId = setInterval(updateIgCountdownOverlay, 50);
}

function stopIgCountdownTicker() {
  if (igCountdownRafId) {
    cancelAnimationFrame(igCountdownRafId);
    igCountdownRafId = null;
  }
  if (igCountdownIntervalId) {
    clearInterval(igCountdownIntervalId);
    igCountdownIntervalId = null;
  }
}

function unmountInstagramWebView(triggeredByExpiry = false) {
  stopIgCountdownTicker();

  const mount = document.getElementById('ig-webview-mount-target');
  const iframe = document.getElementById('ig-direct-webview-iframe');
  if (iframe) {
    try {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'MOON_SCROLL_BANK_EXPIRED' }, '*');
      }
      iframe.src = 'about:blank';
    } catch (e) {}
  }
  if (mount) {
    mount.innerHTML = ''; // Physically unmount and purge WebView from DOM
  }

  // Also purge dedicated tab iframe mount
  const dedMount = document.getElementById('dedicated-ig-mount');
  const dedLockout = document.getElementById('dedicated-ig-lockout');
  const dedDigits = document.getElementById('d-ig-timer-digits');
  if (dedMount) dedMount.innerHTML = '';
  if (dedDigits) dedDigits.textContent = '00:00';

  const placeholder = document.getElementById('ig-webview-lockout-placeholder');
  const overlayEl = document.getElementById('ig-webview-countdown-overlay');
  const digitsEl = document.getElementById('ig-countdown-digits');
  const progressEl = document.getElementById('ig-countdown-progress');
  const statusEl = document.getElementById('ig-countdown-status-text');

  if (digitsEl) digitsEl.textContent = '00:00.0';
  if (progressEl) progressEl.style.width = '0%';
  if (overlayEl) {
    overlayEl.classList.remove('warning');
    overlayEl.classList.add('critical');
  }
  if (statusEl) statusEl.textContent = 'LOCKED \u2022 TIME EXPIRED';

  if (triggeredByExpiry) {
    ensureScrollState();
    const s = AppState.scroll;
    s.sessionEndsAt = null;
    s.balance = 0;
    s.antiScrollActive = true;
    s.antiScrollStartedAt = Date.now();
    saveState();
    renderScroll();
    syncScrollToServer();

    if (placeholder) placeholder.classList.remove('hidden');
    if (dedLockout) dedLockout.classList.remove('hidden');

    playRestTimerChime();
    triggerHaptic([400, 120, 400]);
    showToast('\u26D4 Scroll Bank reached 00:00! Instagram WebView unmounted and locked.');

    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(reg => reg.showNotification('Scroll Bank Depleted (00:00)', {
          body: 'Instagram has been unmounted. Complete push-ups, pull-ups or planks to earn time.',
          icon: 'app_icon_192.png'
        }));
      }
    } catch (e) {}

    // Prompt lock overlay after 2 seconds to cement the restriction
    setTimeout(() => {
      const modal = document.getElementById('modal-ig-webview');
      if (modal && !modal.classList.contains('hidden')) {
        closeModal('modal-ig-webview');
        openAntiScrollLockScreen();
      }
    }, 2200);
  } else {
    if (placeholder) placeholder.classList.add('hidden');
  }
}

function openInAppInstagramWebView() {
  ensureScrollState();
  const s = AppState.scroll;

  const hasActiveSession = Boolean(s.sessionEndsAt && Date.now() < s.sessionEndsAt);
  const hasBankedTime = (s.balance > 0);

  // Strictly enforce scroll bank: user CANNOT open WebView with 0:00 balance
  if (!hasActiveSession && !hasBankedTime) {
    openAntiScrollLockScreen();
    showToast('\uD83D\uDD12 0:00 Scroll Bank! Earn scroll time with push-ups, pull-ups, or planks first.');
    return;
  }

  // Activate scroll session if banked time is available and no session was currently ticking
  if (!hasActiveSession && hasBankedTime) {
    const durationMs = s.balance * 1000;
    s.sessionEndsAt = Date.now() + durationMs;
    igSessionStartDurationMs = durationMs;
    s.balance = 0;
    s.antiScrollActive = true;
    saveState();
    renderScroll();
    syncScrollToServer();
    requestNotifyPermission();
  } else if (hasActiveSession) {
    if (!igSessionStartDurationMs) {
      igSessionStartDurationMs = Math.max(1000, s.sessionEndsAt - Date.now());
    }
  }

  // Hide lockout placeholder & show mount
  const placeholder = document.getElementById('ig-webview-lockout-placeholder');
  if (placeholder) placeholder.classList.add('hidden');

  // Mount clean WebView iframe into DOM
  const mount = document.getElementById('ig-webview-mount-target');
  if (mount) {
    mount.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.id = 'ig-direct-webview-iframe';
    iframe.className = 'ig-direct-iframe';
    iframe.src = 'https://www.instagram.com/direct/inbox/';
    iframe.allow = 'camera; microphone; fullscreen; clipboard-read; clipboard-write; autoplay';
    iframe.sandbox = 'allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-presentation';
    mount.appendChild(iframe);
  }

  openModal('modal-ig-webview');
  startIgCountdownTicker();
  showToast('\uD83D\uDEE1\uFE0F In-App Instagram DM Client mounted (Scroll Bank Live)');
}

function pauseAndBankScrollWebView() {
  ensureScrollState();
  const s = AppState.scroll;
  if (s.sessionEndsAt && Date.now() < s.sessionEndsAt) {
    const remSec = Math.max(0, Math.floor((s.sessionEndsAt - Date.now()) / 1000));
    s.balance = remSec;
    s.sessionEndsAt = null;
    s.antiScrollActive = true;
    saveState();
    renderScroll();
    syncScrollToServer();
    showToast(`\uD83D\uDCBE Saved ${fmtClock(s.balance)} back to your Scroll Bank!`);
  }
  unmountInstagramWebView(false);
  closeModal('modal-ig-webview');
}

function closeInAppInstagramWebView() {
  pauseAndBankScrollWebView();
}

function refreshInAppInstagramWebView() {
  const mount = document.getElementById('ig-webview-mount-target');
  if (mount && AppState.scroll && AppState.scroll.sessionEndsAt && Date.now() < AppState.scroll.sessionEndsAt) {
    mount.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.id = 'ig-direct-webview-iframe';
    iframe.className = 'ig-direct-iframe';
    iframe.src = 'https://www.instagram.com/direct/inbox/';
    iframe.allow = 'camera; microphone; fullscreen; clipboard-read; clipboard-write; autoplay';
    iframe.sandbox = 'allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-presentation';
    mount.appendChild(iframe);
    showToast('\uD83D\uDD04 Reloaded Instagram Direct Client');
  }
}

function resetInAppInstagramToInbox() {
  const iframe = document.getElementById('ig-direct-webview-iframe');
  if (iframe) {
    iframe.src = 'https://www.instagram.com/direct/inbox/';
    showToast('\uD83D\uDCAC Returned to Direct Inbox');
  }
}

function dismissIgGuardBanner() {
  const banner = document.getElementById('ig-webview-guard-banner');
  if (banner) banner.style.display = 'none';
}

async function copyInjectionScriptUrl() {
  const url = `${window.location.origin}/ig_webview_injection.js`;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
      showToast(`\u2705 Injection JS URL copied: ${url}`);
    } else {
      prompt('Copy injection script URL:', url);
    }
  } catch (e) {
    prompt('Copy injection script URL:', url);
  }
}

window.openInAppInstagramWebView = openInAppInstagramWebView;
window.closeInAppInstagramWebView = closeInAppInstagramWebView;
window.pauseAndBankScrollWebView = pauseAndBankScrollWebView;
window.unmountInstagramWebView = unmountInstagramWebView;
window.refreshInAppInstagramWebView = refreshInAppInstagramWebView;
window.resetInAppInstagramToInbox = resetInAppInstagramToInbox;
window.dismissIgGuardBanner = dismissIgGuardBanner;
window.copyInjectionScriptUrl = copyInjectionScriptUrl;

async function openInstagramInboxNoScroll() {
  ensureScrollState();
  if (!AppState.scroll.antiScrollActive) {
    AppState.scroll.antiScrollActive = true;
    AppState.scroll.antiScrollStartedAt = Date.now();
    saveState();
    renderScroll();
    syncScrollToServer();
  }
  if (AppState.settings.dmOnlyMode === false && !AppState.scroll.sessionEndsAt) {
    showToast('\uD83D\uDD12 Strict Full Block is on \u2014 enable "Chat Inbox & Friend Reels Only" switch first!');
    return;
  }
  showToast('\uD83D\uDEE1\uFE0F Launching No-Scroll Instagram Chat Inbox (Feeds & Next-Reel Scroll Locked)');
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    // Launch directly into Instagram Direct Inbox
    window.location.href = 'instagram://direct-inbox';
    return;
  }

  // On PC, ask serve.py to launch Chrome/Edge in App Mode with the Moon Anti-Scroll Extension automatically loaded!
  try {
    const res = await fetch('/api/launch-noscroll-ig');
    if (res.ok) {
      const data = await res.json();
      if (data && data.ok) {
        return;
      }
    }
  } catch (e) {}

  // Fallback compact Messenger-style window
  const popup = window.open(
    'https://www.instagram.com/direct/inbox/',
    'MoonIGMessengerNoScroll',
    'width=430,height=760,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes'
  );
  if (!popup) {
    window.open('https://www.instagram.com/direct/inbox/', '_blank', 'noopener');
  }
}
window.openInstagramInboxNoScroll = openInstagramInboxNoScroll;

// Extract Instagram Reel / Post shortcode OR YouTube Short ID from any friend-sent URL
function parseFriendReelShortcode(raw) {
  const str = (raw || '').trim();
  if (!str) return null;
  // YouTube Shorts or YouTube video sent by a friend
  const ytMatch = str.match(/(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{6,15})/i);
  if (ytMatch && ytMatch[1]) return { type: 'youtube', code: ytMatch[1] };
  // Standard Instagram /reel/CODE, /reels/CODE, /p/CODE, /tv/CODE
  const m = str.match(/instagram\.com\/(?:[^/]+\/)?(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i);
  if (m && m[1]) return { type: 'shortcode', code: m[1] };
  // Modern Instagram share URLs: instagram.com/share/reel/CODE or instagram.com/share/CODE
  const shareMatch = str.match(/instagram\.com\/share\/(?:(?:reel|reels|p)\/)?([A-Za-z0-9_-]+)/i);
  if (shareMatch && shareMatch[1]) return { type: 'share', code: shareMatch[1], url: str };
  if (/^[A-Za-z0-9_-]{6,18}$/.test(str)) return { type: 'shortcode', code: str };
  return null;
}

let swipeGuardTimeout = null;
function flashFriendReelSwipeGuard() {
  const guard = document.getElementById('friend-reel-swipe-guard');
  if (!guard) return;
  guard.classList.remove('hidden');
  // Re-engage touch shield immediately if user tried to scroll
  setFriendReelInteract(false);
  triggerHaptic([45, 30, 45]);
  if (swipeGuardTimeout) clearTimeout(swipeGuardTimeout);
  swipeGuardTimeout = setTimeout(() => {
    guard.classList.add('hidden');
  }, 1800);
}

let reelInteractTimeout = null;
function setFriendReelInteract(allowClickThrough) {
  const shield = document.getElementById('friend-reel-touch-shield');
  const btn = document.getElementById('btn-toggle-reel-interact');
  if (!shield) return;
  if (allowClickThrough) {
    shield.classList.add('passthrough');
    if (btn) btn.textContent = '\uD83D\uDD12 Lock Scroll';
    if (reelInteractTimeout) clearTimeout(reelInteractTimeout);
    // Automatically restore physical scroll shield after 3.5 seconds so user can tap Play/Unmute but cannot doomscroll
    reelInteractTimeout = setTimeout(() => {
      setFriendReelInteract(false);
    }, 3500);
  } else {
    shield.classList.remove('passthrough');
    if (btn) btn.textContent = '\uD83D\uDD0A Tap Video';
    if (reelInteractTimeout) {
      clearTimeout(reelInteractTimeout);
      reelInteractTimeout = null;
    }
  }
}

function toggleFriendReelInteract() {
  const shield = document.getElementById('friend-reel-touch-shield');
  if (!shield) return;
  const currentlyPassthrough = shield.classList.contains('passthrough');
  setFriendReelInteract(!currentlyPassthrough);
  if (!currentlyPassthrough) {
    showToast('\uD83D\uDD0A Tap the Reel now to Play/Unmute (Scroll-Lock re-engages in 3.5s)');
  }
}
window.toggleFriendReelInteract = toggleFriendReelInteract;

async function watchFriendSentReel(rawUrl) {
  ensureScrollState();
  if (!AppState.scroll.antiScrollActive) {
    AppState.scroll.antiScrollActive = true;
    AppState.scroll.antiScrollStartedAt = Date.now();
    saveState();
    renderScroll();
    syncScrollToServer();
  }
  if (AppState.settings.dmOnlyMode === false && !AppState.scroll.sessionEndsAt) {
    showToast('\uD83D\uDD12 Enable Non-Scrolling Mode to watch friend-sent Reels without banked time!');
    return;
  }
  const parsed = parseFriendReelShortcode(rawUrl);
  if (!parsed) {
    showToast('\u26A0\uFE0F Paste a valid Instagram Reel link sent by your friend (e.g. instagram.com/reel/...)');
    return;
  }

  let code = parsed.code;
  if (parsed.type === 'share') {
    try {
      const resp = await fetch('/api/resolve-reel?url=' + encodeURIComponent(parsed.url));
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.shortcode) code = data.shortcode;
      }
    } catch (e) {}
  }

  const viewer = document.getElementById('friend-reel-viewer');
  const iframe = document.getElementById('friend-reel-iframe');
  if (!viewer || !iframe) return;

  setFriendReelInteract(false);
  iframe.removeAttribute('srcdoc');
  if (parsed.type === 'youtube') {
    iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(code)}?rel=0&modestbranding=1&playsinline=1`;
  } else {
    iframe.src = `https://www.instagram.com/reel/${encodeURIComponent(code)}/embed/`;
  }
  viewer.classList.remove('hidden');
  viewer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  showToast('\uD83C\uDFAC Playing friend-sent video in Scroll-Locked Mode (Swiping to next Reel/Short is blocked!)');
}
window.watchFriendSentReel = watchFriendSentReel;

// 1-Tap Sample Friend Reel so user can immediately test the Scroll-Locked Reel Player inside the app
function loadSampleFriendReel() {
  ensureScrollState();
  if (!AppState.scroll.antiScrollActive) {
    AppState.scroll.antiScrollActive = true;
    AppState.scroll.antiScrollStartedAt = Date.now();
    saveState();
    renderScroll();
    syncScrollToServer();
  }
  const viewer = document.getElementById('friend-reel-viewer');
  const iframe = document.getElementById('friend-reel-iframe');
  const input  = document.getElementById('friend-reel-url-input');
  if (!viewer || !iframe) return;

  if (input && !input.value) {
    input.value = 'https://www.instagram.com/reel/FriendSentDemoReel/';
  }
  setFriendReelInteract(false);
  iframe.srcdoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body {
    background: radial-gradient(circle at 50% 25%, #241532 0%, #09090d 75%);
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px 18px;
  }
  .top-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(52, 199, 89, 0.2);
    border: 1px solid rgba(52, 199, 89, 0.55);
    color: #7ef7a6;
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 800;
    align-self: flex-start;
  }
  .center-stage {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }
  .pulse-ring {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: rgba(167, 139, 250, 0.16);
    border: 2px solid #a78bfa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 42px;
    box-shadow: 0 0 30px rgba(167, 139, 250, 0.4);
    animation: pulse 1.8s infinite ease-in-out;
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
  }
  h2 { font-size: 20px; font-weight: 800; letter-spacing: 0.2px; }
  p { font-size: 13px; color: #b4b4c0; max-width: 280px; line-height: 1.45; }
  .try-swipe-box {
    margin-top: 8px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px dashed rgba(255, 255, 255, 0.25);
    border-radius: 14px;
    padding: 12px 16px;
    font-size: 12px;
    color: #e4e4ec;
  }
  .dm-footer {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(0, 0, 0, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 10px 14px;
    border-radius: 14px;
    font-size: 12px;
  }
</style>
</head>
<body>
  <div class="top-pill">&#128172; Sent by @gym_bro in Instagram Messenger</div>
  <div class="center-stage">
    <div class="pulse-ring">&#127916;</div>
    <h2>Friend-Sent Reel Playing (1 of 1)</h2>
    <p>This single Reel from your friend's DM is allowed. Infinite Reel feed scrolling is <strong>physically locked</strong>.</p>
    <div class="try-swipe-box">
      &#128070; <strong>Try scrolling or swiping up/down right now!</strong><br>
      The Anti-Doomscroll Shield will intercept &amp; block the scroll.
    </div>
  </div>
  <div class="dm-footer">
    <span>&#128274;</span>
    <span>Next-Reel Feed Disabled &bull; Paste any real <code>instagram.com/reel/...</code> link above to watch!</span>
  </div>
</body>
</html>`;
  viewer.classList.remove('hidden');
  viewer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  showToast('\uD83D\uDEE1\uFE0F Scroll-Locked Friend Reel active \u2014 try scrolling or swiping up/down on the Reel!');
}
window.loadSampleFriendReel = loadSampleFriendReel;

function closeFriendSentReel() {
  const viewer = document.getElementById('friend-reel-viewer');
  const iframe = document.getElementById('friend-reel-iframe');
  if (iframe) {
    iframe.removeAttribute('srcdoc');
    iframe.src = 'about:blank';
  }
  if (viewer) viewer.classList.add('hidden');
}
window.closeFriendSentReel = closeFriendSentReel;

// Utility: Escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Global Horizontal Swipe Gestures (Smooth slide between Instagram, Focus, Workout, etc.)
function initGlobalSwipeGestures() {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let isSwiping = false;

  const SWIPE_TABS = ['instagram', 'focus', 'workout', 'history', 'ranks', 'settings'];

  document.addEventListener('touchstart', (e) => {
    if (!e.touches || e.touches.length !== 1) return;
    const target = e.target;
    // Don't intercept swipe if user is interacting with form controls, sliders, range inputs, or iframe
    if (target.closest('input, textarea, select, .slider, .opal-hold-cancel-btn, #avatar-cropper, iframe, .ig-webview-viewport, .dedicated-ig-mount')) {
      return;
    }
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
    isSwiping = true;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (!isSwiping || !e.changedTouches || e.changedTouches.length !== 1) {
      isSwiping = false;
      return;
    }
    isSwiping = false;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const duration = Date.now() - touchStartTime;

    // Must be a distinct horizontal swipe: > 45px distance, horizontal > vertical, duration < 600ms
    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25 || duration > 600) {
      return;
    }

    // Determine current active tab
    const activeTabBtn = document.querySelector('.nav-tab.active');
    const currentTab = activeTabBtn ? activeTabBtn.dataset.tab : currentActiveTab || 'workout';
    const currentIndex = SWIPE_TABS.indexOf(currentTab);
    if (currentIndex === -1) return;

    const isRtl = document.documentElement.dir === 'rtl';
    const swipedLeft = isRtl ? (deltaX > 0) : (deltaX < 0);
    const swipedRight = isRtl ? (deltaX < 0) : (deltaX > 0);

    if (swipedLeft && currentIndex < SWIPE_TABS.length - 1) {
      // Finger sliding left -> transition smoothly to next tab
      const nextTab = SWIPE_TABS[currentIndex + 1];
      switchTab(nextTab, 'left');
      triggerHaptic([20]);
    } else if (swipedRight && currentIndex > 0) {
      // Finger sliding right -> transition smoothly to previous tab
      const prevTab = SWIPE_TABS[currentIndex - 1];
      switchTab(prevTab, 'right');
      triggerHaptic([20]);
    }
  }, { passive: true });
}
window.initGlobalSwipeGestures = initGlobalSwipeGestures;

// --- DOM Initialization & Event Handlers ---
// --- Colour Theme ---
const THEME_KEY = 'moon_theme';
const THEME_BAR_COLORS = {
  maroon: '#0B0709',
  lime: '#08090C',
  ocean: '#070B10',
  violet: '#0A0810',
  gold: '#0B0A07',
  crimson: '#0A0406',
  cyan: '#040A0F',
  emerald: '#040B07',
  orange: '#0F0804',
  rose: '#0F050A',
  silver: '#0A0A0A'
};

function applyTheme(id) {
  if (!THEME_BAR_COLORS[id]) id = 'maroon';
  document.documentElement.setAttribute('data-theme', id);
  try { localStorage.setItem(THEME_KEY, id); } catch (e) {}
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME_BAR_COLORS[id]);
  document.querySelectorAll('.theme-swatch').forEach(b =>
    b.classList.toggle('active', b.dataset.themeId === id));
  document.querySelectorAll('.rs-theme-swatch').forEach(b =>
    b.classList.toggle('active', b.dataset.themeId === id));
}
window.applyTheme = applyTheme;

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(document.documentElement.getAttribute('data-theme') || localStorage.getItem(THEME_KEY) || 'maroon');
  document.querySelectorAll('.theme-swatch').forEach(b =>
    b.addEventListener('click', () => applyTheme(b.dataset.themeId)));
  document.querySelectorAll('.rs-theme-swatch').forEach(b =>
    b.addEventListener('click', () => applyTheme(b.dataset.themeId)));
});

document.addEventListener('DOMContentLoaded', () => {

  // Service Worker Registration for PWA with instant controllerchange refresh
  if ('serviceWorker' in navigator) {
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        reg.update();
        console.log('Moon ServiceWorker registered', reg.scope);
      })
      .catch(err => console.log('Moon ServiceWorker failed', err));
  }

  // Restore ongoing active workout if present
  if (AppState.activeWorkout) {
    startWorkoutTimer();
    renderActiveWorkout();
    switchTab('workout');
  } else {
    renderRoutines();
    updateAntiScrollUI();
  }

  // Initialize Opal Futuristic Hold-to-Cancel gesture for active blocks
  if (typeof initHoldToCancel === 'function') {
    initHoldToCancel();
  }

  // Initialize Global Horizontal Swipe Gestures (Instagram <-> Focus <-> Workout)
  if (typeof initGlobalSwipeGestures === 'function') {
    initGlobalSwipeGestures();
  }

  // Rest time selector (per workout)
  document.getElementById('active-rest-select').addEventListener('change', (e) => {
    if (AppState.activeWorkout) {
      AppState.activeWorkout.restSeconds = Number(e.target.value);
      saveState();
      requestNotifyPermission();
      showToast('Rest time set to ' + formatRest(Number(e.target.value)));
    }
  });

  // Doomscroll bank & Non-Scrolling Messenger Shield
  document.getElementById('btn-scroll-toggle').addEventListener('click', toggleScrollSession);
  const su = document.getElementById('scroll-status-url');
  if (su) su.textContent = 'http://' + location.hostname + ':8080/api/scroll';
  fetchLanInfo();

  const dmModeCheckbox = document.getElementById('setting-dm-only-mode');
  if (dmModeCheckbox) {
    dmModeCheckbox.checked = AppState.settings.dmOnlyMode !== false;
    dmModeCheckbox.addEventListener('change', (e) => {
      AppState.settings.dmOnlyMode = Boolean(e.target.checked);
      if (AppState.settings.dmOnlyMode) {
        AppState.scroll.antiScrollActive = true;
        if (!AppState.scroll.antiScrollStartedAt) AppState.scroll.antiScrollStartedAt = Date.now();
      }
      saveState();
      renderScroll();
      syncScrollToServer();
      showToast(AppState.settings.dmOnlyMode
        ? '\uD83D\uDEE1\uFE0F Chat Inbox & Friend Reels Only Mode ON'
        : '\uD83D\uDD12 Strict Full Block ON: Everything locked at 0:00');
    });
  }

  const reelInput     = document.getElementById('friend-reel-url-input');
  const btnPasteReel  = document.getElementById('btn-paste-friend-reel');
  const btnWatchReel  = document.getElementById('btn-watch-friend-reel');
  const btnCloseReel  = document.getElementById('btn-close-friend-reel');
  const btnReplyDm    = document.getElementById('btn-reply-ig-dm');
  const reelWrap      = document.getElementById('friend-reel-frame-wrap');
  const touchShield   = document.getElementById('friend-reel-touch-shield');

  if (btnPasteReel && reelInput) {
    btnPasteReel.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          reelInput.value = text.trim();
          watchFriendSentReel(reelInput.value);
        } else {
          showToast('Clipboard is empty \u2014 paste your friend\'s Reel link into the box');
        }
      } catch (e) {
        reelInput.focus();
        showToast('Long-press inside the box to paste your friend\'s Reel link');
      }
    });
  }
  if (btnWatchReel && reelInput) {
    btnWatchReel.addEventListener('click', () => watchFriendSentReel(reelInput.value));
    reelInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        watchFriendSentReel(reelInput.value);
      }
    });
  }
  if (btnCloseReel) {
    btnCloseReel.addEventListener('click', closeFriendSentReel);
  }
  if (btnReplyDm) {
    btnReplyDm.addEventListener('click', () => {
      closeFriendSentReel();
      openInstagramInboxNoScroll();
    });
  }

  // Bind physical scroll-blocking listeners to both the container and the overlay shield
  [reelWrap, touchShield].forEach((el) => {
    if (!el) return;
    el.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > 6) {
        e.preventDefault();
        e.stopPropagation();
        flashFriendReelSwipeGuard();
      }
    }, { passive: false });

    let touchStartY = null;
    let touchMoved = false;
    el.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        touchMoved = false;
      }
    }, { passive: true });

    el.addEventListener('touchmove', (e) => {
      if (touchStartY !== null && e.touches && e.touches.length === 1) {
        const dy = Math.abs(e.touches[0].clientY - touchStartY);
        if (dy > 14) {
          touchMoved = true;
          e.preventDefault();
          e.stopPropagation();
          flashFriendReelSwipeGuard();
        }
      }
    }, { passive: false });

    el.addEventListener('touchend', () => {
      if (!touchMoved && el === touchShield) {
        // Single tap without vertical swipe -> let user tap Play/Unmute on the video
        setFriendReelInteract(true);
      }
      touchStartY = null;
    });
  });

  if (touchShield) {
    touchShield.addEventListener('click', () => {
      setFriendReelInteract(true);
      showToast('\uD83D\uDD0A Tap the video to Play/Unmute (Vertical scrolling stays locked)');
    });
  }

  renderScroll();
  setInterval(scrollTick, 1000);
  syncScrollToServer();

  // Header & Settings QR buttons
  const qrBtn = document.getElementById('qr-btn');
  if (qrBtn) qrBtn.addEventListener('click', openQRModal);
  const settingsQrBtn = document.getElementById('btn-show-qr-settings');
  if (settingsQrBtn) settingsQrBtn.addEventListener('click', openQRModal);
  const copyUrlBtn = document.getElementById('btn-copy-url');
  if (copyUrlBtn) {
    copyUrlBtn.addEventListener('click', () => {
      const input = document.getElementById('lan-url-input');
      if (input) {
        input.select();
        navigator.clipboard.writeText(input.value);
        alert('URL copied to clipboard! Open Safari on your iPhone and paste it.');
      }
    });
  }

  // Routine Buttons
  const quickWoBtn = document.getElementById('btn-quick-workout');
  if (quickWoBtn) quickWoBtn.addEventListener('click', () => startBlankWorkout());
  const idleWoBtn = document.getElementById('btn-idle-start-blank');
  if (idleWoBtn) idleWoBtn.addEventListener('click', () => startBlankWorkout());

  // Active Workout Actions
  document.getElementById('btn-finish-workout').addEventListener('click', () => finishActiveWorkout());
  document.getElementById('btn-cancel-workout').addEventListener('click', () => cancelActiveWorkout());
  document.getElementById('btn-add-exercise-active').addEventListener('click', () => openExercisePicker('workout'));

  document.getElementById('active-workout-name').addEventListener('input', (e) => {
    if (AppState.activeWorkout) {
      AppState.activeWorkout.title = e.target.value;
      saveState();
    }
  });

  // Rest Timer Controls
  document.getElementById('timer-btn-minus').addEventListener('click', () => {
    if (restTimerMode === 'countdown') {
      restTimeRemaining = Math.max(5, restTimeRemaining - 15);
      restEndsAt -= 15000;
    } else {
      restStopwatchPaused = !restStopwatchPaused;
      if (!restStopwatchPaused) {
        // Resuming from pause
        restStartedAt = Date.now();
      }
    }
    updateRestTimerUI();
    triggerHaptic([20]);
  });

  document.getElementById('timer-btn-plus').addEventListener('click', () => {
    if (restTimerMode === 'countdown') {
      restTimeRemaining += 30;
      restEndsAt += 30000;
      restTotalDuration += 30;
    } else {
      restStartedAt = Date.now();
      restEndsAt = 0;
      showToast('\u23F1\uFE0F Rest Stopwatch reset to 0s');
    }
    updateRestTimerUI();
    triggerHaptic([20]);
  });

  document.getElementById('timer-btn-skip').addEventListener('click', () => {
    closeRestTimer();
    triggerHaptic([20]);
  });

  // Celebration Done Button
  document.getElementById('btn-celebration-done').addEventListener('click', () => {
    closeModal('modal-celebration');
    switchTab('history');
  });

  // Exercise Picker Search & Category Chips
  const exSearchInput = document.getElementById('exercise-search-input');
  exSearchInput.addEventListener('input', renderExercisePickerList);

  document.querySelectorAll('#exercise-category-chips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#exercise-category-chips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      pickerCategory = chip.dataset.cat;
      renderExercisePickerList();
    });
  });

  // Custom Exercise Creation
  document.getElementById('btn-save-custom-ex').addEventListener('click', () => {
    const nameInput = document.getElementById('custom-ex-name');
    const catSelect = document.getElementById('custom-ex-cat');
    const name = nameInput.value.trim();
    if (!name) return;

    const newEx = {
      id: 'ex_custom_' + Date.now(),
      name: name,
      category: catSelect.value
    };

    AppState.exercises.push(newEx);
    saveState();
    nameInput.value = '';
    renderExercisePickerList();
    triggerHaptic([40]);
  });

  // PR Category Filter Chips
  document.querySelectorAll('#pr-filter-chips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#pr-filter-chips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      prCategoryFilter = chip.dataset.filter;
      renderPRs();
    });
  });

  // Create Routine Modal
  document.getElementById('btn-create-routine').addEventListener('click', () => {
    newRoutineSelectedExerciseIds = [];
    document.getElementById('new-routine-name').value = '';
    document.getElementById('new-routine-tag').value = '';
    const isFeaturedCheck = document.getElementById('new-routine-is-featured');
    if (isFeaturedCheck) isFeaturedCheck.checked = false;
    switchCreateRoutineTab('custom');
    renderRoutineBuilderExercises();
    openModal('modal-create-routine');
  });

  document.getElementById('btn-builder-add-exercise').addEventListener('click', () => {
    openExercisePicker('routine_builder');
  });

  document.getElementById('btn-save-new-routine').addEventListener('click', () => {
    const name = document.getElementById('new-routine-name').value.trim();
    const tag = document.getElementById('new-routine-tag').value.trim();
    const isFeaturedCheck = document.getElementById('new-routine-is-featured');
    const isFeatured = isFeaturedCheck ? isFeaturedCheck.checked : false;

    if (!name) {
      alert('Please enter a routine name.');
      return;
    }
    if (newRoutineSelectedExerciseIds.length === 0) {
      alert('Please pick at least one exercise.');
      return;
    }

    const newRoutine = {
      id: 'routine_' + Date.now(),
      name: name,
      tag: tag || (isFeatured ? 'Featured Split' : 'Custom Routine'),
      exerciseIds: [...newRoutineSelectedExerciseIds],
      isFeatured: isFeatured
    };

    AppState.routines.push(newRoutine);
    saveState();
    closeModal('modal-create-routine');
    if (isFeaturedCheck) isFeaturedCheck.checked = false;
    renderRoutines();
    triggerHaptic([60]);
    showToast(`Saved routine "${name}"`);
  });

  // Settings: Unit Toggle
  document.querySelectorAll('#unit-toggle-group .unit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#unit-toggle-group .unit-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.settings.unit = btn.dataset.unit;
      saveState();
      renderRoutines();
      renderPRs();
      if (AppState.activeWorkout) renderActiveWorkout();
    });
  });

  // Set default unit active button
  document.querySelectorAll('#unit-toggle-group .unit-btn').forEach(btn => {
    if (btn.dataset.unit === AppState.settings.unit) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Settings: Language Switcher Toggle Sync
  const currentAppLang = (window.I18N && window.I18N.getLanguage()) || localStorage.getItem('moon_app_lang') || 'en';
  const langBtnEn = document.getElementById('btn-lang-en');
  const langBtnAr = document.getElementById('btn-lang-ar');
  if (langBtnEn) langBtnEn.classList.toggle('active', currentAppLang === 'en');
  if (langBtnAr) langBtnAr.classList.toggle('active', currentAppLang === 'ar');

  // Settings: Default Rest Select
  const restSelect = document.getElementById('default-rest-select');
  restSelect.value = AppState.settings.defaultRest || 90;
  restSelect.addEventListener('change', (e) => {
    AppState.settings.defaultRest = Number(e.target.value);
    saveState();
  });

  // Settings: Toggles
  const soundToggle = document.getElementById('setting-sound');
  soundToggle.checked = AppState.settings.sound;
  soundToggle.addEventListener('change', (e) => {
    AppState.settings.sound = e.target.checked;
    saveState();
    if (e.target.checked) playSetCompletePing();
  });

  const hapticsToggle = document.getElementById('setting-haptics');
  hapticsToggle.checked = AppState.settings.haptics;
  hapticsToggle.addEventListener('change', (e) => {
    AppState.settings.haptics = e.target.checked;
    saveState();
    if (e.target.checked) triggerHaptic([50]);
  });

  const demoToggle = document.getElementById('setting-demo-mode');
  if (demoToggle) {
    demoToggle.checked = AppState.settings.demoMode === true;
    demoToggle.addEventListener('change', (e) => {
      AppState.settings.demoMode = e.target.checked;
      syncDemoState(AppState);
      saveState();
      updateOverviewStats();
      renderHistory();
      renderPRs();
      if (typeof renderRanks === 'function') renderRanks();
      showToast(e.target.checked ? 'Demo mode enabled (sample data loaded)' : 'Demo mode disabled');
    });
  }

  // Settings: Backup & Restore
  document.getElementById('btn-export-data').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(AppState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `moon_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  document.getElementById('file-import-data').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported && imported.history && imported.exercises) {
          AppState = imported;
          saveState();
          alert('Data restored successfully!');
          window.location.reload();
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  });

  document.getElementById('btn-reset-demo').addEventListener('click', () => {
    if (confirm('Reset all workout history, PRs, and ranks to a clean state?')) {
      localStorage.removeItem(STORAGE_KEY);
      AppState = getInitialState();
      saveState();
      window.location.reload();
    }
  });

  // Ensure Anti-Scroll Shield elements are strictly positioned inside focus tab
  updateAntiScrollUI();

  // --- Initial App Splash Screen Auto-Routing (5s duration) ---
  initSplashScreenTimer();

});

// Splash Screen Lifecycle & Full Intro Audio + Destination Selector (Routines vs Focus)
let splashDismissed = false;
let splashAudio = null;
let splashIdleSafetyTimer = null;

function setSplashSoundStatus(state, message) {
  const container = document.getElementById('splash-sound-status');
  const label = document.getElementById('splash-sound-label');
  if (!container || !label) return;

  container.classList.remove('playing', 'blocked');
  if (state) {
    container.classList.add(state);
  }
  if (message) {
    label.textContent = message;
  }
}

function handleSplashUserInteraction(e) {
  // Splash screen interaction handler - auto-play on random screen taps removed.
  // Intro MP3 audio is strictly attached to the Sign Up / Login buttons.
}

function stopSplashAudio() {
  if (splashAudio) {
    try {
      splashAudio.pause();
      splashAudio.currentTime = 0;
    } catch (e) {}
  }
}

// Requirement 3: Dedicated Startup Intro Audio Trigger attached strictly to Sign Up / Login onClick
window.playStartupAudio = function() {
  try {
    stopSplashAudio();
    splashAudio = document.getElementById('splash-audio');
    if (!splashAudio) {
      splashAudio = new Audio('startup.mp3');
    }
    splashAudio.playsInline = true;
    splashAudio.volume = 1.0;
    splashAudio.currentTime = 0;
    splashAudio.muted = false;

    splashAudio.onended = () => {
      console.log('[Splash Audio] Intro startup sound completed fully.');
    };

    const p = splashAudio.play();
    if (p !== undefined) {
      p.then(() => {
        setSplashSoundStatus('playing', 'Sound active 🔊');
      }).catch((err) => {
        console.warn('[Splash Audio] Audio playback pending or blocked:', err);
      });
    }
  } catch (e) {
    console.warn('[Splash Audio] Startup audio error:', e);
  }
};

window.playSplashAudio = window.playStartupAudio;

// Handle initial startup options: Sign Up / Login
window.handleStartupAuth = function(mode, e) {
  if (e && e.stopPropagation) {
    e.stopPropagation();
  }

  // Play startup MP3 audio strictly on user click
  window.playStartupAudio();

  // Dismiss splash screen smoothly while preserving audio playback
  dismissSplashScreen(e, true);

  // Switch auth tab to requested mode
  if (typeof window.switchAuthTab === 'function') {
    window.switchAuthTab(mode);
  }

  // Open the auth modal for user interaction
  setTimeout(() => {
    window.openModal('modal-auth');
  }, 250);

  try {
    triggerHaptic([30, 45]);
  } catch (err) {}
};

window.selectAppDestination = function(destination, e) {
  if (e && e.stopPropagation) {
    e.stopPropagation();
  }
  if (splashDismissed) return;

  if (splashIdleSafetyTimer) {
    clearTimeout(splashIdleSafetyTimer);
    splashIdleSafetyTimer = null;
  }

  // Route to user's selected tab
  if (destination === 'focus') {
    switchTab('focus');
  } else {
    switchTab('workout');
  }

  // Stop audio and dismiss splash
  dismissSplashScreen();
  try {
    triggerHaptic([30, 45]);
  } catch (err) {}
};

function dismissSplashScreen(e, keepAudio) {
  if (e && e.stopPropagation) {
    e.stopPropagation();
  }
  if (splashDismissed) return;
  splashDismissed = true;

  if (splashIdleSafetyTimer) {
    clearTimeout(splashIdleSafetyTimer);
    splashIdleSafetyTimer = null;
  }

  // Stop audio unless user explicitly clicked Sign Up / Login (keepAudio = true)
  if (!keepAudio) {
    stopSplashAudio();
  }

  ['touchstart', 'touchend', 'pointerdown', 'pointerup', 'click'].forEach((evt) => {
    window.removeEventListener(evt, handleSplashUserInteraction, { capture: true });
  });

  const splash = document.getElementById('app-splash-screen');
  if (!splash) return;

  splash.removeEventListener('pointerdown', handleSplashUserInteraction);
  splash.removeEventListener('touchstart', handleSplashUserInteraction);

  splash.classList.add('fade-out');

  try {
    triggerHaptic([25]);
  } catch (e) {}

  setTimeout(() => {
    splash.classList.add('hidden');
    splash.style.display = 'none';
  }, 700);
}

function initSplashScreenTimer() {
  const splash = document.getElementById('app-splash-screen');
  if (!splash) return;

  // Requirement 3: onMount auto-play audio removed from splash screen.
  // Audio playback logic is strictly attached to onClick of Sign Up / Login buttons.
}

window.dismissSplashScreen = dismissSplashScreen;
window.showSplashScreen = function() {
  const splash = document.getElementById('app-splash-screen');
  if (splash) {
    splashDismissed = false;
    splash.style.display = '';
    splash.classList.remove('hidden', 'fade-out');
    const picker = document.getElementById('splash-dest-picker');
    if (picker) picker.classList.remove('pulse-ready');
    initSplashScreenTimer();
  }
};

// ==================== AUTHENTICATION & AI COACH GLUE ====================
window.openAuthModal = function() {
  window.openModal('modal-auth');
};

window.openAICoachModal = function() {
  if (window.AuthSystem && typeof window.AuthSystem.updateCoachModalUI === 'function') {
    window.AuthSystem.updateCoachModalUI();
  }
  window.openModal('modal-ai-coach');
};

window.switchAuthTab = function(mode) {
  const btnSignIn = document.getElementById('btn-auth-tab-signin');
  const btnSignUp = document.getElementById('btn-auth-tab-signup');
  const formSignIn = document.getElementById('form-auth-signin');
  const formSignUp = document.getElementById('form-auth-signup');

  if (mode === 'signup') {
    if (btnSignIn) btnSignIn.classList.remove('active');
    if (btnSignUp) btnSignUp.classList.add('active');
    if (formSignIn) formSignIn.classList.add('hidden');
    if (formSignUp) formSignUp.classList.remove('hidden');
  } else {
    if (btnSignIn) btnSignIn.classList.add('active');
    if (btnSignUp) btnSignUp.classList.remove('active');
    if (formSignIn) formSignIn.classList.remove('hidden');
    if (formSignUp) formSignUp.classList.add('hidden');
  }
  triggerHaptic([20]);
};

window.selectSignupGender = function(gender) {
  const maleCard = document.getElementById('card-gender-male');
  const femCard = document.getElementById('card-gender-female');
  const input = document.getElementById('signup-gender');

  if (gender === 'female') {
    if (maleCard) maleCard.classList.remove('active');
    if (femCard) femCard.classList.add('active');
    if (input) input.value = 'female';
  } else {
    if (maleCard) maleCard.classList.add('active');
    if (femCard) femCard.classList.remove('active');
    if (input) input.value = 'male';
  }
  triggerHaptic([30]);
};

window.selectSignupCoach = function(coachId) {
  const cardN = document.getElementById('card-coach-n');
  const cardM = document.getElementById('card-coach-m');
  const input = document.getElementById('signup-coach');

  const isM = (coachId === 'M' || coachId === 'Maryam');
  if (isM) {
    if (cardN) cardN.classList.remove('active');
    if (cardM) cardM.classList.add('active');
    if (input) input.value = 'Maryam';
  } else {
    if (cardN) cardN.classList.add('active');
    if (cardM) cardM.classList.remove('active');
    if (input) input.value = 'Nurv';
  }
  triggerHaptic([30]);
};

window.handleAuthSignIn = function(e) {
  if (e) e.preventDefault();
  const idInput = document.getElementById('signin-identifier');
  const passInput = document.getElementById('signin-password');
  if (!idInput || !passInput) return;

  try {
    if (window.AuthSystem) {
      window.AuthSystem.login(idInput.value, passInput.value);
    }
  } catch (err) {
    if (typeof showToast === 'function') {
      showToast('⚠️ ' + err.message);
    } else {
      alert(err.message);
    }
  }
};

window.handleAuthSignUp = function(e) {
  if (e) e.preventDefault();
  const nameInput = document.getElementById('signup-name');
  const userEl = document.getElementById('signup-username');
  const passEl = document.getElementById('signup-password');
  const genderEl = document.getElementById('signup-gender');
  const coachEl = document.getElementById('signup-coach');
  const adminKeyEl = document.getElementById('signup-adminkey');

  const displayName = nameInput ? nameInput.value.trim() : '';
  const username = userEl ? userEl.value.trim() : '';
  const password = passEl ? passEl.value : '';
  const gender = genderEl ? genderEl.value : 'male';
  const aiCoach = coachEl ? coachEl.value : 'Nurv';
  const adminSecret = adminKeyEl ? adminKeyEl.value.trim() : '';

  try {
    if (window.AuthSystem) {
      window.AuthSystem.signUp({
        displayName,
        username,
        password,
        gender,
        aiCoach,
        adminSecret
      });
    }
  } catch (err) {
    if (typeof showToast === 'function') {
      showToast('⚠️ ' + err.message);
    } else {
      alert(err.message);
    }
  }
};

window.toggleCoachVoice = function() {
  if (window.AuthSystem) {
    window.AuthSystem.voiceEnabled = !window.AuthSystem.voiceEnabled;
    const v = window.AuthSystem.voiceEnabled;
    const voiceLabel = document.getElementById('coach-voice-label');
    const voiceIcon = document.getElementById('coach-voice-icon');
    if (voiceLabel) voiceLabel.textContent = v ? 'Voice: ON' : 'Voice: OFF';
    if (voiceIcon) voiceIcon.textContent = v ? '🔊' : '🔇';
    if (typeof showToast === 'function') {
      showToast(`Coach voice audio: ${v ? 'ENABLED' : 'MUTED'}`);
    }
  }
};

window.askCoachPrompt = function(promptText) {
  const stream = document.getElementById('coach-chat-stream');
  if (!stream || !window.AuthSystem) return;

  const coach = window.AuthSystem && window.AuthSystem.getCoach ? window.AuthSystem.getCoach() : { sigilText: 'Nurv', accentColor: '#E0506A' };

  // Append user message
  const userMsgDiv = document.createElement('div');
  userMsgDiv.className = 'coach-msg user';
  userMsgDiv.innerHTML = `
    <div class="coach-msg-bubble">${escapeHtml(promptText)}</div>
  `;
  stream.appendChild(userMsgDiv);

  // Get AI reply
  const reply = window.AuthSystem.askCoach(promptText);

  // Append Coach reply
  const coachMsgDiv = document.createElement('div');
  coachMsgDiv.className = 'coach-msg assistant';
  coachMsgDiv.innerHTML = `
    <div class="coach-msg-avatar" style="border-color:${coach.accentColor || '#E0506A'}"><img src="${coach.avatarImg || (coach.gender === 'female' ? 'coach_blackcat.png' : 'coach_spiderman.png')}" alt="${coach.name || 'Coach'}" class="coach-avatar-img"></div>
    <div class="coach-msg-bubble">${escapeHtml(reply)}</div>
  `;
  stream.appendChild(coachMsgDiv);
  stream.scrollTop = stream.scrollHeight;
  triggerHaptic([30]);
};

window.handleCoachChatSubmit = function(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('coach-chat-input');
  if (!input || !input.value.trim()) return;
  const query = input.value.trim();
  input.value = '';
  window.askCoachPrompt(query);
};
