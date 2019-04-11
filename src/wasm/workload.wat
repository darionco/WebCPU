(module
  (type (;0;) (func (result f64)))
  (type (;1;) (func (param i32 i32)))
  (type (;2;) (func (param f64 i32) (result f64)))
  (type (;3;) (func (param f64 f64 i32) (result f64)))
  (type (;4;) (func (param f64 f64) (result f64)))
  (type (;5;) (func (param f64 i32) (result i32)))
  (type (;6;) (func (param i32 i32 i32 i32) (result i32)))
  (type (;7;) (func (param f64) (result f64)))
  (import "env" "_now" (func (;0;) (type 0)))
  (import "env" "memory" (memory (;0;) 16 16))
  (func (;1;) (type 3) (param f64 f64 i32) (result f64)
    (local f64 f64 f64)
    local.get 0
    local.get 0
    f64.mul
    local.tee 3
    local.get 3
    local.get 3
    f64.mul
    f64.mul
    local.get 3
    f64.const 0x1.5d93a5acfd57cp-33 (;=1.58969e-10;)
    f64.mul
    f64.const -0x1.ae5e68a2b9cebp-26 (;=-2.50508e-08;)
    f64.add
    f64.mul
    local.get 3
    local.get 3
    f64.const 0x1.71de357b1fe7dp-19 (;=2.75573e-06;)
    f64.mul
    f64.const -0x1.a01a019c161d5p-13 (;=-0.000198413;)
    f64.add
    f64.mul
    f64.const 0x1.111111110f8a6p-7 (;=0.00833333;)
    f64.add
    f64.add
    local.set 5
    local.get 3
    local.get 0
    f64.mul
    local.set 4
    local.get 2
    if (result f64)  ;; label = @1
      local.get 0
      local.get 4
      f64.const 0x1.5555555555549p-3 (;=0.166667;)
      f64.mul
      local.get 3
      local.get 1
      f64.const 0x1p-1 (;=0.5;)
      f64.mul
      local.get 4
      local.get 5
      f64.mul
      f64.sub
      f64.mul
      local.get 1
      f64.sub
      f64.add
      f64.sub
    else
      local.get 4
      local.get 3
      local.get 5
      f64.mul
      f64.const -0x1.5555555555549p-3 (;=-0.166667;)
      f64.add
      f64.mul
      local.get 0
      f64.add
    end)
  (func (;2;) (type 4) (param f64 f64) (result f64)
    (local f64 f64 f64 f64)
    local.get 0
    local.get 0
    f64.mul
    local.tee 2
    local.get 2
    f64.mul
    local.set 3
    f64.const 0x1p+0 (;=1;)
    local.get 2
    f64.const 0x1p-1 (;=0.5;)
    f64.mul
    local.tee 4
    f64.sub
    local.tee 5
    f64.const 0x1p+0 (;=1;)
    local.get 5
    f64.sub
    local.get 4
    f64.sub
    local.get 2
    local.get 2
    local.get 2
    local.get 2
    f64.const 0x1.a01a019cb159p-16 (;=2.48016e-05;)
    f64.mul
    f64.const -0x1.6c16c16c15177p-10 (;=-0.00138889;)
    f64.add
    f64.mul
    f64.const 0x1.555555555554cp-5 (;=0.0416667;)
    f64.add
    f64.mul
    local.get 3
    local.get 3
    f64.mul
    local.get 2
    f64.const 0x1.1ee9ebdb4b1c4p-29 (;=2.08757e-09;)
    local.get 2
    f64.const 0x1.8fae9be8838d4p-37 (;=1.13596e-11;)
    f64.mul
    f64.sub
    f64.mul
    f64.const -0x1.27e4f809c52adp-22 (;=-2.75573e-07;)
    f64.add
    f64.mul
    f64.add
    f64.mul
    local.get 0
    local.get 1
    f64.mul
    f64.sub
    f64.add
    f64.add)
  (func (;3;) (type 2) (param f64 i32) (result f64)
    (local i32 i32)
    local.get 1
    i32.const 1023
    i32.gt_s
    if  ;; label = @1
      local.get 0
      f64.const 0x1p+1023 (;=8.98847e+307;)
      f64.mul
      local.tee 0
      f64.const 0x1p+1023 (;=8.98847e+307;)
      f64.mul
      local.get 0
      local.get 1
      i32.const 2046
      i32.gt_s
      local.tee 2
      select
      local.set 0
      local.get 1
      i32.const -2046
      i32.add
      local.tee 3
      i32.const 1023
      local.get 3
      i32.const 1023
      i32.lt_s
      select
      local.get 1
      i32.const -1023
      i32.add
      local.get 2
      select
      local.set 1
    else
      local.get 1
      i32.const -1022
      i32.lt_s
      if  ;; label = @2
        local.get 0
        f64.const 0x1p-1022 (;=2.22507e-308;)
        f64.mul
        local.tee 0
        f64.const 0x1p-1022 (;=2.22507e-308;)
        f64.mul
        local.get 0
        local.get 1
        i32.const -2044
        i32.lt_s
        local.tee 2
        select
        local.set 0
        local.get 1
        i32.const 2044
        i32.add
        local.tee 3
        i32.const -1022
        local.get 3
        i32.const -1022
        i32.gt_s
        select
        local.get 1
        i32.const 1022
        i32.add
        local.get 2
        select
        local.set 1
      end
    end
    local.get 0
    local.get 1
    i32.const 1023
    i32.add
    i64.extend_i32_u
    i64.const 52
    i64.shl
    f64.reinterpret_i64
    f64.mul)
  (func (;4;) (type 5) (param f64 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i64 f64 f64 f64 f64)
    global.get 0
    local.set 4
    global.get 0
    i32.const 48
    i32.add
    global.set 0
    local.get 4
    i32.const 16
    i32.add
    local.set 5
    local.get 0
    i64.reinterpret_f64
    local.tee 10
    i64.const 63
    i64.shr_u
    i32.wrap_i64
    local.set 6
    block (result i32)  ;; label = @1
      block  ;; label = @2
        local.get 10
        i64.const 32
        i64.shr_u
        i32.wrap_i64
        local.tee 2
        i32.const 2147483647
        i32.and
        local.tee 3
        i32.const 1074752123
        i32.lt_u
        if (result i32)  ;; label = @3
          local.get 2
          i32.const 1048575
          i32.and
          i32.const 598523
          i32.eq
          br_if 1 (;@2;)
          local.get 6
          i32.const 0
          i32.ne
          local.set 2
          local.get 3
          i32.const 1073928573
          i32.lt_u
          if (result i32)  ;; label = @4
            local.get 2
            if (result i32)  ;; label = @5
              local.get 1
              local.get 0
              f64.const 0x1.921fb544p+0 (;=1.5708;)
              f64.add
              local.tee 0
              f64.const 0x1.0b4611a626331p-34 (;=6.0771e-11;)
              f64.add
              local.tee 11
              f64.store
              local.get 1
              local.get 0
              local.get 11
              f64.sub
              f64.const 0x1.0b4611a626331p-34 (;=6.0771e-11;)
              f64.add
              f64.store offset=8
              i32.const -1
            else
              local.get 1
              local.get 0
              f64.const -0x1.921fb544p+0 (;=-1.5708;)
              f64.add
              local.tee 0
              f64.const -0x1.0b4611a626331p-34 (;=-6.0771e-11;)
              f64.add
              local.tee 11
              f64.store
              local.get 1
              local.get 0
              local.get 11
              f64.sub
              f64.const -0x1.0b4611a626331p-34 (;=-6.0771e-11;)
              f64.add
              f64.store offset=8
              i32.const 1
            end
          else
            local.get 2
            if (result i32)  ;; label = @5
              local.get 1
              local.get 0
              f64.const 0x1.921fb544p+1 (;=3.14159;)
              f64.add
              local.tee 0
              f64.const 0x1.0b4611a626331p-33 (;=1.21542e-10;)
              f64.add
              local.tee 11
              f64.store
              local.get 1
              local.get 0
              local.get 11
              f64.sub
              f64.const 0x1.0b4611a626331p-33 (;=1.21542e-10;)
              f64.add
              f64.store offset=8
              i32.const -2
            else
              local.get 1
              local.get 0
              f64.const -0x1.921fb544p+1 (;=-3.14159;)
              f64.add
              local.tee 0
              f64.const -0x1.0b4611a626331p-33 (;=-1.21542e-10;)
              f64.add
              local.tee 11
              f64.store
              local.get 1
              local.get 0
              local.get 11
              f64.sub
              f64.const -0x1.0b4611a626331p-33 (;=-1.21542e-10;)
              f64.add
              f64.store offset=8
              i32.const 2
            end
          end
        else
          block (result i32)  ;; label = @4
            local.get 3
            i32.const 1075594812
            i32.lt_u
            if  ;; label = @5
              local.get 3
              i32.const 1075183037
              i32.lt_u
              if  ;; label = @6
                local.get 3
                i32.const 1074977148
                i32.eq
                br_if 4 (;@2;)
                local.get 6
                if  ;; label = @7
                  local.get 1
                  local.get 0
                  f64.const 0x1.2d97c7f3p+2 (;=4.71239;)
                  f64.add
                  local.tee 0
                  f64.const 0x1.90e91a79394cap-33 (;=1.82313e-10;)
                  f64.add
                  local.tee 11
                  f64.store
                  local.get 1
                  local.get 0
                  local.get 11
                  f64.sub
                  f64.const 0x1.90e91a79394cap-33 (;=1.82313e-10;)
                  f64.add
                  f64.store offset=8
                  i32.const -3
                  br 3 (;@4;)
                else
                  local.get 1
                  local.get 0
                  f64.const -0x1.2d97c7f3p+2 (;=-4.71239;)
                  f64.add
                  local.tee 0
                  f64.const -0x1.90e91a79394cap-33 (;=-1.82313e-10;)
                  f64.add
                  local.tee 11
                  f64.store
                  local.get 1
                  local.get 0
                  local.get 11
                  f64.sub
                  f64.const -0x1.90e91a79394cap-33 (;=-1.82313e-10;)
                  f64.add
                  f64.store offset=8
                  i32.const 3
                  br 3 (;@4;)
                end
                unreachable
              else
                local.get 3
                i32.const 1075388923
                i32.eq
                br_if 4 (;@2;)
                local.get 6
                if  ;; label = @7
                  local.get 1
                  local.get 0
                  f64.const 0x1.921fb544p+2 (;=6.28319;)
                  f64.add
                  local.tee 0
                  f64.const 0x1.0b4611a626331p-32 (;=2.43084e-10;)
                  f64.add
                  local.tee 11
                  f64.store
                  local.get 1
                  local.get 0
                  local.get 11
                  f64.sub
                  f64.const 0x1.0b4611a626331p-32 (;=2.43084e-10;)
                  f64.add
                  f64.store offset=8
                  i32.const -4
                  br 3 (;@4;)
                else
                  local.get 1
                  local.get 0
                  f64.const -0x1.921fb544p+2 (;=-6.28319;)
                  f64.add
                  local.tee 0
                  f64.const -0x1.0b4611a626331p-32 (;=-2.43084e-10;)
                  f64.add
                  local.tee 11
                  f64.store
                  local.get 1
                  local.get 0
                  local.get 11
                  f64.sub
                  f64.const -0x1.0b4611a626331p-32 (;=-2.43084e-10;)
                  f64.add
                  f64.store offset=8
                  i32.const 4
                  br 3 (;@4;)
                end
                unreachable
              end
              unreachable
            end
            local.get 3
            i32.const 1094263291
            i32.lt_u
            br_if 2 (;@2;)
            local.get 3
            i32.const 2146435071
            i32.gt_u
            if  ;; label = @5
              local.get 1
              local.get 0
              local.get 0
              f64.sub
              local.tee 0
              f64.store offset=8
              local.get 1
              local.get 0
              f64.store
              i32.const 0
              br 1 (;@4;)
            end
            local.get 10
            i64.const 4503599627370495
            i64.and
            i64.const 4710765210229538816
            i64.or
            f64.reinterpret_i64
            local.set 0
            i32.const 0
            local.set 2
            loop  ;; label = @5
              local.get 2
              i32.const 3
              i32.shl
              local.get 5
              i32.add
              local.get 0
              i32.trunc_f64_s
              f64.convert_i32_s
              local.tee 11
              f64.store
              local.get 0
              local.get 11
              f64.sub
              f64.const 0x1p+24 (;=1.67772e+07;)
              f64.mul
              local.set 0
              local.get 2
              i32.const 1
              i32.add
              local.tee 2
              i32.const 2
              i32.ne
              br_if 0 (;@5;)
            end
            local.get 5
            local.get 0
            f64.store offset=16
            local.get 0
            f64.const 0x0p+0 (;=0;)
            f64.eq
            if  ;; label = @5
              i32.const 1
              local.set 2
              loop  ;; label = @6
                local.get 2
                i32.const -1
                i32.add
                local.set 7
                local.get 2
                i32.const 3
                i32.shl
                local.get 5
                i32.add
                f64.load
                f64.const 0x0p+0 (;=0;)
                f64.eq
                if  ;; label = @7
                  local.get 7
                  local.set 2
                  br 1 (;@6;)
                end
              end
            else
              i32.const 2
              local.set 2
            end
            local.get 5
            local.get 4
            local.get 3
            i32.const 20
            i32.shr_u
            i32.const -1046
            i32.add
            local.get 2
            i32.const 1
            i32.add
            call 8
            local.set 2
            local.get 4
            f64.load
            local.set 0
            local.get 6
            if (result i32)  ;; label = @5
              local.get 1
              local.get 0
              f64.neg
              f64.store
              local.get 1
              local.get 4
              f64.load offset=8
              f64.neg
              f64.store offset=8
              i32.const 0
              local.get 2
              i32.sub
            else
              local.get 1
              local.get 0
              f64.store
              local.get 1
              local.get 4
              f64.load offset=8
              f64.store offset=8
              local.get 2
            end
          end
        end
        br 1 (;@1;)
      end
      local.get 0
      f64.const 0x1.45f306dc9c883p-1 (;=0.63662;)
      f64.mul
      f64.const 0x1.8p+52 (;=6.7554e+15;)
      f64.add
      f64.const -0x1.8p+52 (;=-6.7554e+15;)
      f64.add
      local.tee 12
      i32.trunc_f64_s
      local.set 8
      local.get 1
      local.get 0
      local.get 12
      f64.const 0x1.921fb544p+0 (;=1.5708;)
      f64.mul
      f64.sub
      local.tee 11
      local.get 12
      f64.const 0x1.0b4611a626331p-34 (;=6.0771e-11;)
      f64.mul
      local.tee 0
      f64.sub
      local.tee 13
      f64.store
      local.get 3
      i32.const 20
      i32.shr_u
      local.tee 7
      local.get 13
      i64.reinterpret_f64
      i64.const 52
      i64.shr_u
      i32.wrap_i64
      i32.const 2047
      i32.and
      i32.sub
      i32.const 16
      i32.gt_s
      if  ;; label = @2
        local.get 12
        f64.const 0x1.3198a2e037073p-69 (;=2.02227e-21;)
        f64.mul
        local.get 11
        local.get 11
        local.get 12
        f64.const 0x1.0b4611a6p-34 (;=6.0771e-11;)
        f64.mul
        local.tee 0
        f64.sub
        local.tee 11
        f64.sub
        local.get 0
        f64.sub
        f64.sub
        local.set 0
        local.get 1
        local.get 11
        local.get 0
        f64.sub
        local.tee 13
        f64.store
        local.get 12
        f64.const 0x1.b839a252049c1p-104 (;=8.47843e-32;)
        f64.mul
        local.get 11
        local.get 11
        local.get 12
        f64.const 0x1.3198a2ep-69 (;=2.02227e-21;)
        f64.mul
        local.tee 14
        f64.sub
        local.tee 12
        f64.sub
        local.get 14
        f64.sub
        f64.sub
        local.set 14
        local.get 7
        local.get 13
        i64.reinterpret_f64
        i64.const 52
        i64.shr_u
        i32.wrap_i64
        i32.const 2047
        i32.and
        i32.sub
        i32.const 49
        i32.gt_s
        if  ;; label = @3
          local.get 1
          local.get 12
          local.get 14
          f64.sub
          local.tee 13
          f64.store
          local.get 14
          local.set 0
          local.get 12
          local.set 11
        end
      end
      local.get 1
      local.get 11
      local.get 13
      f64.sub
      local.get 0
      f64.sub
      f64.store offset=8
      local.get 8
    end
    local.set 9
    local.get 4
    global.set 0
    local.get 9)
  (func (;5;) (type 1) (param i32 i32)
    (local i32 i32 i32 f32 f32 f32 f32 f32 f32 f32 f32 f64)
    call 0
    f32.demote_f64
    local.tee 7
    local.get 7
    f32.sub
    local.tee 5
    local.get 0
    f32.convert_i32_s
    local.tee 11
    f32.lt
    i32.eqz
    if  ;; label = @1
      local.get 1
      i32.const 0
      i32.store
      local.get 1
      local.get 5
      f32.store offset=8
      local.get 1
      i32.const 0
      i32.store offset=4
      return
    end
    f32.const -0x1.99999ap-1 (;=-0.8;)
    local.set 8
    f32.const 0x1.3f7ceep-3 (;=0.156;)
    local.set 9
    loop  ;; label = @1
      i32.const 0
      local.set 0
      loop  ;; label = @2
        local.get 0
        i32.const 50
        i32.div_u
        i32.const -2
        i32.add
        f32.convert_i32_s
        local.set 12
        i32.const 0
        local.set 3
        loop  ;; label = @3
          local.get 12
          local.set 5
          local.get 3
          i32.const 50
          i32.div_u
          i32.const -2
          i32.add
          f32.convert_i32_s
          local.set 6
          i32.const 0
          local.set 4
          loop  ;; label = @4
            local.get 9
            local.get 6
            f32.const 0x1p+1 (;=2;)
            f32.mul
            local.get 5
            f32.mul
            f32.add
            local.tee 10
            local.get 10
            f32.mul
            local.get 8
            local.get 6
            local.get 6
            f32.mul
            local.get 5
            local.get 5
            f32.mul
            f32.sub
            f32.add
            local.tee 6
            local.get 6
            f32.mul
            f32.add
            f32.const 0x1p+2 (;=4;)
            f32.lt
            if  ;; label = @5
              local.get 4
              i32.const 1
              i32.add
              local.tee 4
              i32.const 25
              i32.lt_u
              if  ;; label = @6
                local.get 10
                local.set 5
                br 2 (;@4;)
              end
            end
          end
          local.get 3
          i32.const 1
          i32.add
          local.tee 3
          i32.const 200
          i32.ne
          br_if 0 (;@3;)
        end
        local.get 0
        i32.const 1
        i32.add
        local.tee 0
        i32.const 200
        i32.ne
        br_if 0 (;@2;)
      end
      local.get 2
      i32.const 1
      i32.add
      local.tee 2
      f64.convert_i32_s
      local.tee 13
      f64.const 0x1.f6a7a2955385ep+5 (;=62.8319;)
      f64.div
      call 6
      f64.const 0x1.3333333333333p-1 (;=0.6;)
      f64.mul
      f64.const -0x1.999999999999ap-1 (;=-0.8;)
      f64.add
      f32.demote_f64
      local.set 8
      local.get 13
      f64.const 0x1.f6a7a2955385ep+6 (;=125.664;)
      f64.div
      call 7
      f64.const 0x1.999999999999ap-2 (;=0.4;)
      f64.mul
      f64.const 0x1.3f7ced916872bp-3 (;=0.156;)
      f64.add
      f32.demote_f64
      local.set 9
      call 0
      f32.demote_f64
      local.get 7
      f32.sub
      local.tee 5
      local.get 11
      f32.lt
      br_if 0 (;@1;)
    end
    local.get 6
    i32.trunc_f32_s
    local.set 0
    local.get 1
    local.get 2
    i32.store
    local.get 1
    local.get 5
    f32.store offset=8
    local.get 1
    local.get 0
    i32.store offset=4)
  (func (;6;) (type 7) (param f64) (result f64)
    (local i32 i32)
    global.get 0
    local.set 1
    global.get 0
    i32.const 16
    i32.add
    global.set 0
    local.get 0
    i64.reinterpret_f64
    i64.const 32
    i64.shr_u
    i32.wrap_i64
    i32.const 2147483647
    i32.and
    local.tee 2
    i32.const 1072243196
    i32.lt_u
    if  ;; label = @1
      local.get 2
      i32.const 1045430272
      i32.ge_u
      if  ;; label = @2
        local.get 0
        f64.const 0x0p+0 (;=0;)
        i32.const 0
        call 1
        local.set 0
      end
    else
      block (result f64)  ;; label = @2
        local.get 0
        local.get 0
        f64.sub
        local.get 2
        i32.const 2146435071
        i32.gt_u
        br_if 0 (;@2;)
        drop
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                local.get 0
                local.get 1
                call 4
                i32.const 3
                i32.and
                br_table 0 (;@6;) 1 (;@5;) 2 (;@4;) 3 (;@3;)
              end
              local.get 1
              f64.load
              local.get 1
              f64.load offset=8
              i32.const 1
              call 1
              br 3 (;@2;)
            end
            local.get 1
            f64.load
            local.get 1
            f64.load offset=8
            call 2
            br 2 (;@2;)
          end
          local.get 1
          f64.load
          local.get 1
          f64.load offset=8
          i32.const 1
          call 1
          f64.neg
          br 1 (;@2;)
        end
        local.get 1
        f64.load
        local.get 1
        f64.load offset=8
        call 2
        f64.neg
      end
      local.set 0
    end
    local.get 1
    global.set 0
    local.get 0)
  (func (;7;) (type 7) (param f64) (result f64)
    (local i32 i32 f64)
    global.get 0
    local.set 1
    global.get 0
    i32.const 16
    i32.add
    global.set 0
    local.get 0
    i64.reinterpret_f64
    i64.const 32
    i64.shr_u
    i32.wrap_i64
    i32.const 2147483647
    i32.and
    local.tee 2
    i32.const 1072243196
    i32.lt_u
    if (result f64)  ;; label = @1
      local.get 2
      i32.const 1044816030
      i32.lt_u
      if (result f64)  ;; label = @2
        f64.const 0x1p+0 (;=1;)
      else
        local.get 0
        f64.const 0x0p+0 (;=0;)
        call 2
      end
    else
      block (result f64)  ;; label = @2
        local.get 0
        local.get 0
        f64.sub
        local.get 2
        i32.const 2146435071
        i32.gt_u
        br_if 0 (;@2;)
        drop
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                local.get 0
                local.get 1
                call 4
                i32.const 3
                i32.and
                br_table 0 (;@6;) 1 (;@5;) 2 (;@4;) 3 (;@3;)
              end
              local.get 1
              f64.load
              local.get 1
              f64.load offset=8
              call 2
              br 3 (;@2;)
            end
            local.get 1
            f64.load
            local.get 1
            f64.load offset=8
            i32.const 1
            call 1
            f64.neg
            br 2 (;@2;)
          end
          local.get 1
          f64.load
          local.get 1
          f64.load offset=8
          call 2
          f64.neg
          br 1 (;@2;)
        end
        local.get 1
        f64.load
        local.get 1
        f64.load offset=8
        i32.const 1
        call 1
      end
    end
    local.set 3
    local.get 1
    global.set 0
    local.get 3)
  (func (;8;) (type 6) (param i32 i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 f64)
    global.get 0
    local.set 11
    global.get 0
    i32.const 560
    i32.add
    global.set 0
    local.get 11
    i32.const 320
    i32.add
    local.set 13
    local.get 2
    i32.const -3
    i32.add
    i32.const 24
    i32.div_s
    local.tee 4
    i32.const 0
    local.get 4
    i32.const 0
    i32.gt_s
    select
    local.set 16
    i32.const 1028
    i32.load
    local.tee 12
    local.get 3
    i32.const -1
    i32.add
    local.tee 6
    i32.add
    i32.const 0
    i32.ge_s
    if  ;; label = @1
      local.get 3
      local.get 12
      i32.add
      local.set 8
      local.get 16
      local.get 6
      i32.sub
      local.set 4
      loop  ;; label = @2
        local.get 5
        i32.const 3
        i32.shl
        local.get 13
        i32.add
        local.get 4
        i32.const 0
        i32.lt_s
        if (result f64)  ;; label = @3
          f64.const 0x0p+0 (;=0;)
        else
          local.get 4
          i32.const 2
          i32.shl
          i32.const 1040
          i32.add
          i32.load
          f64.convert_i32_s
        end
        f64.store
        local.get 4
        i32.const 1
        i32.add
        local.set 4
        local.get 5
        i32.const 1
        i32.add
        local.tee 5
        local.get 8
        i32.ne
        br_if 0 (;@2;)
      end
    end
    local.get 11
    i32.const 480
    i32.add
    local.set 10
    local.get 11
    i32.const 160
    i32.add
    local.set 14
    local.get 16
    i32.const -24
    i32.mul
    local.tee 20
    local.get 2
    i32.const -24
    i32.add
    i32.add
    local.set 8
    local.get 3
    i32.const 0
    i32.gt_s
    local.set 7
    i32.const 0
    local.set 4
    loop  ;; label = @1
      local.get 7
      if  ;; label = @2
        local.get 4
        local.get 6
        i32.add
        local.set 9
        f64.const 0x0p+0 (;=0;)
        local.set 26
        i32.const 0
        local.set 5
        loop  ;; label = @3
          local.get 26
          local.get 5
          i32.const 3
          i32.shl
          local.get 0
          i32.add
          f64.load
          local.get 9
          local.get 5
          i32.sub
          i32.const 3
          i32.shl
          local.get 13
          i32.add
          f64.load
          f64.mul
          f64.add
          local.set 26
          local.get 5
          i32.const 1
          i32.add
          local.tee 5
          local.get 3
          i32.ne
          br_if 0 (;@3;)
        end
      else
        f64.const 0x0p+0 (;=0;)
        local.set 26
      end
      local.get 4
      i32.const 3
      i32.shl
      local.get 11
      i32.add
      local.get 26
      f64.store
      local.get 4
      i32.const 1
      i32.add
      local.set 5
      local.get 4
      local.get 12
      i32.lt_s
      if  ;; label = @2
        local.get 5
        local.set 4
        br 1 (;@1;)
      end
    end
    local.get 8
    i32.const 0
    i32.gt_s
    local.set 17
    i32.const 24
    local.get 8
    i32.sub
    local.set 18
    i32.const 23
    local.get 8
    i32.sub
    local.set 21
    local.get 8
    i32.eqz
    local.set 22
    local.get 3
    i32.const 0
    i32.gt_s
    local.set 23
    local.get 12
    local.set 4
    block  ;; label = @1
      block  ;; label = @2
        loop  ;; label = @3
          block  ;; label = @4
            local.get 4
            i32.const 3
            i32.shl
            local.get 11
            i32.add
            f64.load
            local.set 26
            local.get 4
            i32.const 0
            i32.gt_s
            local.tee 9
            if  ;; label = @5
              local.get 4
              local.set 5
              i32.const 0
              local.set 6
              loop  ;; label = @6
                local.get 6
                i32.const 2
                i32.shl
                local.get 10
                i32.add
                local.get 26
                local.get 26
                f64.const 0x1p-24 (;=5.96046e-08;)
                f64.mul
                i32.trunc_f64_s
                f64.convert_i32_s
                local.tee 26
                f64.const 0x1p+24 (;=1.67772e+07;)
                f64.mul
                f64.sub
                i32.trunc_f64_s
                i32.store
                local.get 5
                i32.const -1
                i32.add
                local.tee 7
                i32.const 3
                i32.shl
                local.get 11
                i32.add
                f64.load
                local.get 26
                f64.add
                local.set 26
                local.get 6
                i32.const 1
                i32.add
                local.set 6
                local.get 5
                i32.const 1
                i32.gt_s
                if  ;; label = @7
                  local.get 7
                  local.set 5
                  br 1 (;@6;)
                end
              end
            end
            local.get 26
            local.get 8
            call 3
            local.tee 26
            local.get 26
            f64.const 0x1p-3 (;=0.125;)
            f64.mul
            f64.floor
            f64.const 0x1p+3 (;=8;)
            f64.mul
            f64.sub
            local.tee 26
            i32.trunc_f64_s
            local.set 5
            local.get 26
            local.get 5
            f64.convert_i32_s
            f64.sub
            local.set 26
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  local.get 17
                  if (result i32)  ;; label = @8
                    local.get 4
                    i32.const -1
                    i32.add
                    i32.const 2
                    i32.shl
                    local.get 10
                    i32.add
                    local.tee 7
                    i32.load
                    local.tee 15
                    local.get 18
                    i32.shr_s
                    local.set 6
                    local.get 7
                    local.get 15
                    local.get 6
                    local.get 18
                    i32.shl
                    i32.sub
                    local.tee 7
                    i32.store
                    local.get 7
                    local.get 21
                    i32.shr_s
                    local.set 7
                    local.get 5
                    local.get 6
                    i32.add
                    local.set 5
                    br 1 (;@7;)
                  else
                    local.get 22
                    if (result i32)  ;; label = @9
                      local.get 4
                      i32.const -1
                      i32.add
                      i32.const 2
                      i32.shl
                      local.get 10
                      i32.add
                      i32.load
                      i32.const 23
                      i32.shr_s
                      local.set 7
                      br 2 (;@7;)
                    else
                      local.get 26
                      f64.const 0x1p-1 (;=0.5;)
                      f64.ge
                      if (result i32)  ;; label = @10
                        i32.const 2
                        local.set 7
                        br 4 (;@6;)
                      else
                        i32.const 0
                      end
                    end
                  end
                  local.set 7
                  br 2 (;@5;)
                end
                local.get 7
                i32.const 0
                i32.gt_s
                br_if 0 (;@6;)
                br 1 (;@5;)
              end
              block (result i32)  ;; label = @6
                local.get 5
                local.set 25
                local.get 9
                if (result i32)  ;; label = @7
                  i32.const 0
                  local.set 5
                  i32.const 0
                  local.set 9
                  loop (result i32)  ;; label = @8
                    local.get 9
                    i32.const 2
                    i32.shl
                    local.get 10
                    i32.add
                    local.tee 24
                    i32.load
                    local.set 15
                    block  ;; label = @9
                      block  ;; label = @10
                        local.get 5
                        if (result i32)  ;; label = @11
                          i32.const 16777215
                          local.set 19
                          br 1 (;@10;)
                        else
                          local.get 15
                          if (result i32)  ;; label = @12
                            i32.const 1
                            local.set 5
                            i32.const 16777216
                            local.set 19
                            br 2 (;@10;)
                          else
                            i32.const 0
                          end
                        end
                        local.set 5
                        br 1 (;@9;)
                      end
                      local.get 24
                      local.get 19
                      local.get 15
                      i32.sub
                      i32.store
                    end
                    local.get 9
                    i32.const 1
                    i32.add
                    local.tee 9
                    local.get 4
                    i32.ne
                    br_if 0 (;@8;)
                    local.get 5
                  end
                else
                  i32.const 0
                end
                local.set 9
                local.get 17
                if  ;; label = @7
                  block  ;; label = @8
                    block  ;; label = @9
                      block  ;; label = @10
                        local.get 8
                        i32.const 1
                        i32.sub
                        br_table 0 (;@10;) 1 (;@9;) 2 (;@8;)
                      end
                      local.get 4
                      i32.const -1
                      i32.add
                      i32.const 2
                      i32.shl
                      local.get 10
                      i32.add
                      local.tee 5
                      local.get 5
                      i32.load
                      i32.const 8388607
                      i32.and
                      i32.store
                      br 1 (;@8;)
                    end
                    local.get 4
                    i32.const -1
                    i32.add
                    i32.const 2
                    i32.shl
                    local.get 10
                    i32.add
                    local.tee 5
                    local.get 5
                    i32.load
                    i32.const 4194303
                    i32.and
                    i32.store
                  end
                end
                local.get 25
              end
              i32.const 1
              i32.add
              local.set 5
              local.get 7
              i32.const 2
              i32.eq
              if  ;; label = @6
                f64.const 0x1p+0 (;=1;)
                local.get 26
                f64.sub
                local.set 26
                local.get 9
                if  ;; label = @7
                  local.get 26
                  f64.const 0x1p+0 (;=1;)
                  local.get 8
                  call 3
                  f64.sub
                  local.set 26
                end
                i32.const 2
                local.set 7
              end
            end
            local.get 26
            f64.const 0x0p+0 (;=0;)
            f64.ne
            br_if 2 (;@2;)
            local.get 4
            local.get 12
            i32.gt_s
            if  ;; label = @5
              i32.const 0
              local.set 9
              local.get 4
              local.set 6
              loop  ;; label = @6
                local.get 9
                local.get 6
                i32.const -1
                i32.add
                local.tee 6
                i32.const 2
                i32.shl
                local.get 10
                i32.add
                i32.load
                i32.or
                local.set 9
                local.get 6
                local.get 12
                i32.gt_s
                br_if 0 (;@6;)
              end
              local.get 9
              br_if 1 (;@4;)
            end
            i32.const 1
            local.set 5
            loop  ;; label = @5
              local.get 5
              i32.const 1
              i32.add
              local.set 6
              local.get 12
              local.get 5
              i32.sub
              i32.const 2
              i32.shl
              local.get 10
              i32.add
              i32.load
              i32.eqz
              if  ;; label = @6
                local.get 6
                local.set 5
                br 1 (;@5;)
              end
            end
            local.get 4
            local.get 5
            i32.add
            local.set 6
            loop  ;; label = @5
              local.get 3
              local.get 4
              i32.add
              local.tee 7
              i32.const 3
              i32.shl
              local.get 13
              i32.add
              local.get 4
              i32.const 1
              i32.add
              local.tee 5
              local.get 16
              i32.add
              i32.const 2
              i32.shl
              i32.const 1040
              i32.add
              i32.load
              f64.convert_i32_s
              f64.store
              local.get 23
              if  ;; label = @6
                f64.const 0x0p+0 (;=0;)
                local.set 26
                i32.const 0
                local.set 4
                loop  ;; label = @7
                  local.get 26
                  local.get 4
                  i32.const 3
                  i32.shl
                  local.get 0
                  i32.add
                  f64.load
                  local.get 7
                  local.get 4
                  i32.sub
                  i32.const 3
                  i32.shl
                  local.get 13
                  i32.add
                  f64.load
                  f64.mul
                  f64.add
                  local.set 26
                  local.get 4
                  i32.const 1
                  i32.add
                  local.tee 4
                  local.get 3
                  i32.ne
                  br_if 0 (;@7;)
                end
              else
                f64.const 0x0p+0 (;=0;)
                local.set 26
              end
              local.get 5
              i32.const 3
              i32.shl
              local.get 11
              i32.add
              local.get 26
              f64.store
              local.get 5
              local.get 6
              i32.lt_s
              if  ;; label = @6
                local.get 5
                local.set 4
                br 1 (;@5;)
              end
            end
            local.get 6
            local.set 4
            br 1 (;@3;)
          end
        end
        local.get 8
        local.set 0
        loop (result i32)  ;; label = @3
          local.get 0
          i32.const -24
          i32.add
          local.set 0
          local.get 4
          i32.const -1
          i32.add
          local.tee 4
          i32.const 2
          i32.shl
          local.get 10
          i32.add
          i32.load
          i32.eqz
          br_if 0 (;@3;)
          local.get 0
          local.set 2
          local.get 4
        end
        local.set 0
        br 1 (;@1;)
      end
      local.get 26
      i32.const 0
      local.get 8
      i32.sub
      call 3
      local.tee 26
      f64.const 0x1p+24 (;=1.67772e+07;)
      f64.ge
      if (result i32)  ;; label = @2
        local.get 4
        i32.const 2
        i32.shl
        local.get 10
        i32.add
        local.get 26
        local.get 26
        f64.const 0x1p-24 (;=5.96046e-08;)
        f64.mul
        i32.trunc_f64_s
        local.tee 3
        f64.convert_i32_s
        f64.const 0x1p+24 (;=1.67772e+07;)
        f64.mul
        f64.sub
        i32.trunc_f64_s
        i32.store
        local.get 2
        local.get 20
        i32.add
        local.set 2
        local.get 4
        i32.const 1
        i32.add
      else
        local.get 8
        local.set 2
        local.get 26
        i32.trunc_f64_s
        local.set 3
        local.get 4
      end
      local.tee 0
      i32.const 2
      i32.shl
      local.get 10
      i32.add
      local.get 3
      i32.store
    end
    f64.const 0x1p+0 (;=1;)
    local.get 2
    call 3
    local.set 26
    local.get 0
    i32.const -1
    i32.gt_s
    local.tee 6
    if  ;; label = @1
      local.get 0
      local.set 2
      loop  ;; label = @2
        local.get 2
        i32.const 3
        i32.shl
        local.get 11
        i32.add
        local.get 26
        local.get 2
        i32.const 2
        i32.shl
        local.get 10
        i32.add
        i32.load
        f64.convert_i32_s
        f64.mul
        f64.store
        local.get 26
        f64.const 0x1p-24 (;=5.96046e-08;)
        f64.mul
        local.set 26
        local.get 2
        i32.const -1
        i32.add
        local.set 3
        local.get 2
        i32.const 0
        i32.gt_s
        if  ;; label = @3
          local.get 3
          local.set 2
          br 1 (;@2;)
        end
      end
      local.get 6
      if  ;; label = @2
        local.get 0
        local.set 2
        loop  ;; label = @3
          local.get 0
          local.get 2
          i32.sub
          local.set 8
          i32.const 0
          local.set 3
          f64.const 0x0p+0 (;=0;)
          local.set 26
          loop  ;; label = @4
            local.get 26
            local.get 3
            i32.const 3
            i32.shl
            i32.const 1312
            i32.add
            f64.load
            local.get 2
            local.get 3
            i32.add
            i32.const 3
            i32.shl
            local.get 11
            i32.add
            f64.load
            f64.mul
            f64.add
            local.set 26
            local.get 3
            i32.const 1
            i32.add
            local.set 4
            local.get 3
            local.get 12
            i32.ge_s
            local.get 3
            local.get 8
            i32.ge_u
            i32.or
            i32.eqz
            if  ;; label = @5
              local.get 4
              local.set 3
              br 1 (;@4;)
            end
          end
          local.get 8
          i32.const 3
          i32.shl
          local.get 14
          i32.add
          local.get 26
          f64.store
          local.get 2
          i32.const -1
          i32.add
          local.set 3
          local.get 2
          i32.const 0
          i32.gt_s
          if  ;; label = @4
            local.get 3
            local.set 2
            br 1 (;@3;)
          end
        end
      end
    end
    local.get 6
    if  ;; label = @1
      f64.const 0x0p+0 (;=0;)
      local.set 26
      local.get 0
      local.set 2
      loop  ;; label = @2
        local.get 26
        local.get 2
        i32.const 3
        i32.shl
        local.get 14
        i32.add
        f64.load
        f64.add
        local.set 26
        local.get 2
        i32.const -1
        i32.add
        local.set 3
        local.get 2
        i32.const 0
        i32.gt_s
        if  ;; label = @3
          local.get 3
          local.set 2
          br 1 (;@2;)
        end
      end
    else
      f64.const 0x0p+0 (;=0;)
      local.set 26
    end
    local.get 1
    local.get 26
    local.get 26
    f64.neg
    local.get 7
    i32.eqz
    local.tee 4
    select
    f64.store
    local.get 14
    f64.load
    local.get 26
    f64.sub
    local.set 26
    local.get 0
    i32.const 1
    i32.ge_s
    if  ;; label = @1
      i32.const 1
      local.set 2
      loop  ;; label = @2
        local.get 26
        local.get 2
        i32.const 3
        i32.shl
        local.get 14
        i32.add
        f64.load
        f64.add
        local.set 26
        local.get 2
        i32.const 1
        i32.add
        local.set 3
        local.get 0
        local.get 2
        i32.ne
        if  ;; label = @3
          local.get 3
          local.set 2
          br 1 (;@2;)
        end
      end
    end
    local.get 1
    local.get 26
    local.get 26
    f64.neg
    local.get 4
    select
    f64.store offset=8
    local.get 11
    global.set 0
    local.get 5
    i32.const 7
    i32.and)
  (global (;0;) (mut i32) (i32.const 3168))
  (export "_runWorkload" (func 5))
  (data (;0;) (i32.const 1024) "\03\00\00\00\04\00\00\00\04\00\00\00\06\00\00\00\83\f9\a2\00DNn\00\fc)\15\00\d1W'\00\dd4\f5\00b\db\c0\00<\99\95\00A\90C\00cQ\fe\00\bb\de\ab\00\b7a\c5\00:n$\00\d2MB\00I\06\e0\00\09\ea.\00\1c\92\d1\00\eb\1d\fe\00)\b1\1c\00\e8>\a7\00\f55\82\00D\bb.\00\9c\e9\84\00\b4&p\00A~_\00\d6\919\00S\839\00\9c\f49\00\8b_\84\00(\f9\bd\00\f8\1f;\00\de\ff\97\00\0f\98\05\00\11/\ef\00\0aZ\8b\00m\1fm\00\cf~6\00\09\cb'\00FO\b7\00\9ef?\00-\ea_\00\ba'u\00\e5\eb\c7\00={\f1\00\f79\07\00\92R\8a\00\fbk\ea\00\1f\b1_\00\08]\8d\000\03V\00{\fcF\00\f0\abk\00 \bc\cf\006\f4\9a\00\e3\a9\1d\00^a\91\00\08\1b\e6\00\85\99e\00\a0\14_\00\8d@h\00\80\d8\ff\00'sM\00\06\061\00\caV\15\00\c9\a8s\00{\e2`\00k\8c\c0")
  (data (;1;) (i32.const 1315) "@\fb!\f9?\00\00\00\00-Dt>\00\00\00\80\98F\f8<\00\00\00`Q\ccx;\00\00\00\80\83\1b\f09\00\00\00@ %z8\00\00\00\80\22\82\e36\00\00\00\00\1d\f3i5"))
